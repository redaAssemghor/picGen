const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { randomUUID } = require("node:crypto");
const ts = require("typescript");
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const root = process.cwd();
const userId = "picgen_test_" + randomUUID();
let signedIn = userId;
let providerCalls = 0;
let providerFailure = false;
let providerArgs;
const overrides = {
  "@/app/lib/prisma": prisma,
  "@clerk/nextjs/server": { auth: () => ({ userId: signedIn }), currentUser: async () => null },
  "@huggingface/inference": { InferenceClient: class { async textToImage(args) { providerCalls++; providerArgs = args; if (providerFailure) throw new Error("private provider details"); return new Blob(["test-image"], { type: "image/png" }); } } },
};
const cache = new Map();
function load(filename) {
  filename = path.resolve(root, filename);
  if (!fs.existsSync(filename)) filename += ".ts";
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename, module);
  mod.filename = filename; mod.paths = Module._nodeModulePaths(path.dirname(filename)); cache.set(filename, mod);
  mod.require = name => {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name.startsWith("@/")) return load(name.slice(2));
    if (name.startsWith(".")) return load(path.resolve(path.dirname(filename), name));
    return require(name);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
  return mod.exports;
}
const { parseGeneration, modelPrompt } = load("lib/generation.ts");
const credits = load("app/lib/credits.ts");
const generate = load("app/api/fetchImg/route.ts");
const imageRoute = load("app/api/images/[id]/route.ts");
const accountRoute = load("app/api/user/getUser/route.ts");
const stripeWebhook = load("app/api/webhooks/stripe/route.ts");
const Stripe = require("stripe");
const input = overrides => ({ requestId: randomUUID(), prompt: "A tiny lavender planet", model: "z-image", ratio: "3:4", style: "cinematic", seed: 42, ...overrides });
const request = data => new Request("http://localhost/api/fetchImg", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } });
async function points() { return (await prisma.user.findUnique({ where: { id: userId } })).points; }
before(async () => {
  await prisma.user.create({ data: { id: userId, email: userId + "@example.invalid", points: 50 } });
});
beforeEach(async () => {
  signedIn = userId; providerCalls = 0; providerFailure = false;
  await prisma.generation.deleteMany({ where: { userId } });
  await prisma.creditPurchase.deleteMany({ where: { userId } });
  await prisma.user.update({ where: { id: userId }, data: { points: 50 } });
});
after(async () => {
  await prisma.generation.deleteMany({ where: { userId } });
  await prisma.creditPurchase.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});
test("validates model, settings, prompt length, UUID, and seed", () => {
  assert.equal(parseGeneration(input({ prompt: "  A planet  " })).prompt, "A planet");
  for (const invalid of [{ prompt: " " }, { prompt: "x".repeat(1501) }, { model: "__proto__" }, { ratio: "16:9" }, { style: "unknown" }, { seed: -1 }, { seed: 1.5 }, { seed: 2147483648 }, { requestId: "../other-user" }]) assert.throws(() => parseGeneration(input(invalid)));
  assert.match(modelPrompt(input()), /cinematic composition/);
});
test("unauthenticated generation cannot spend credits or call provider", async () => {
  signedIn = null;
  assert.equal((await generate.POST(request(input()))).status, 401);
  assert.equal(providerCalls, 0); assert.equal(await points(), 50);
});
test("invalid input does not spend credits", async () => {
  assert.equal((await generate.POST(request(input({ seed: -1 })))).status, 400);
  assert.equal(await points(), 50);
});
test("insufficient balance cannot become negative", async () => {
  await prisma.user.update({ where: { id: userId }, data: { points: 4 } });
  assert.equal((await generate.POST(request(input()))).status, 402);
  assert.equal(await points(), 4); assert.equal(providerCalls, 0);
});
test("successful generation stores an image and charges exactly once", async () => {
  const body = input();
  const first = await generate.POST(request(body));
  assert.equal(first.status, 200);
  assert.equal(await points(), 45);
  assert.deepEqual(providerArgs.parameters.image_size, { width: 768, height: 1024 });
  assert.equal(providerArgs.parameters.seed, 42);
  const saved = await prisma.generation.findUnique({ where: { id: body.requestId } });
  assert.equal(saved.status, "completed"); assert.ok(saved.image);
  assert.equal((await generate.POST(request(body))).status, 200);
  assert.equal(providerCalls, 1); assert.equal(await points(), 45);
});
test("reusing an ID with changed settings is rejected", async () => {
  const body = input();
  await generate.POST(request(body));
  assert.equal((await generate.POST(request({ ...body, prompt: "A different planet" }))).status, 409);
  assert.equal(await points(), 45); assert.equal(providerCalls, 1);
});
test("provider failure refunds credits and hides provider details", async () => {
  providerFailure = true;
  const response = await generate.POST(request(input()));
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /private provider details/);
  assert.equal(await points(), 50);
});
test("concurrent requests reserve only one generation", async () => {
  const outcomes = await Promise.allSettled([credits.reserve(userId, input()), credits.reserve(userId, input())]);
  assert.equal(outcomes.filter(result => result.status === "fulfilled").length, 1);
  assert.equal(await points(), 45);
});
test("refunds are idempotent", async () => {
  const body = input();
  await credits.reserve(userId, body);
  await Promise.all([credits.refund(body.requestId, userId), credits.refund(body.requestId, userId)]);
  assert.equal(await points(), 50);
});
test("expired pending jobs are recovered once", async () => {
  const body = input();
  await credits.reserve(userId, body);
  await prisma.generation.update({ where: { id: body.requestId }, data: { createdAt: new Date(Date.now() - 360000) } });
  await credits.recoverExpired(userId); await credits.recoverExpired(userId);
  assert.equal(await points(), 50);
});
test("another account cannot view or favorite a private image", async () => {
  const body = input(); await generate.POST(request(body)); signedIn = "another-account";
  assert.equal((await imageRoute.GET(new Request("http://localhost"), { params: { id: body.requestId } })).status, 404);
  assert.equal((await imageRoute.PATCH(new Request("http://localhost", { method: "PATCH", body: JSON.stringify({ favorite: true }) }), { params: { id: body.requestId } })).status, 404);
});
test("downloads preserve content type and use attachment headers", async () => {
  const body = input(); await generate.POST(request(body));
  const response = await imageRoute.GET(new Request("http://localhost?download=1"), { params: { id: body.requestId } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "image/png");
  assert.match(response.headers.get("Content-Disposition"), /attachment; filename="picgen-/);
});
test("balance endpoint ignores spoofed user IDs", async () => {
  const response = await accountRoute.POST(new Request("http://localhost", { method: "POST", body: JSON.stringify({ id: "another-account" }) }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { points: 50 });
});
test("signed paid webhook grants credits once; duplicate delivery is safe", async () => {
  const original = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_picgen_test_only";
  try {
    const stripe = new Stripe("sk_test_placeholder");
    const payload = JSON.stringify({ id: "evt_test_" + randomUUID(), type: "checkout.session.completed", data: { object: { id: "cs_test_" + randomUUID().replaceAll("-", ""), payment_status: "paid", mode: "payment", currency: "usd", amount_total: 399, client_reference_id: userId, metadata: { userId, plan: "basic" } } } });
    const signature = stripe.webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET });
    const req = () => new Request("http://localhost/api/webhooks/stripe", { method: "POST", body: payload, headers: { "stripe-signature": signature } });
    assert.equal((await stripeWebhook.POST(req())).status, 200);
    assert.equal((await stripeWebhook.POST(req())).status, 200);
    assert.equal(await points(), 90);
    assert.equal((await stripeWebhook.POST(new Request("http://localhost", { method: "POST", body: payload }))).status, 400);
  } finally { process.env.STRIPE_WEBHOOK_SECRET = original; }
});

test("cross-origin and non-JSON generation requests are rejected", async () => {
  const crossOrigin = new Request("http://localhost/api/fetchImg", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://untrusted.example" }, body: JSON.stringify(input()) });
  assert.equal((await generate.POST(crossOrigin)).status, 403);
  assert.equal((await generate.POST(new Request("http://localhost/api/fetchImg", { method: "POST", body: JSON.stringify(input()) }))).status, 415);
  assert.equal(providerCalls, 0);
});
test("generation rate limit also counts refunded attempts", async () => {
  for (let i = 0; i < 6; i++) {
    const body = input();
    await credits.reserve(userId, body);
    await credits.refund(body.requestId, userId);
  }
  assert.equal((await generate.POST(request(input()))).status, 429);
  assert.equal(await points(), 50);
});
test("signup signature uses raw body and duplicate delivery never resets credits", async () => {
  const { Webhook } = require("svix");
  const original = process.env.WEBHOOK_SECRET;
  process.env.WEBHOOK_SECRET = "whsec_" + Buffer.alloc(32, 7).toString("base64");
  try {
    const signup = load("app/api/webhooks/clerk/route.ts");
    await prisma.user.update({ where: { id: userId }, data: { points: 15 } });
    const payload = JSON.stringify({ type: "user.created", data: { id: userId, primary_email_address_id: "primary", email_addresses: [{ id: "primary", email_address: userId + "@example.invalid" }] } }, null, 2);
    const now = new Date();
    const messageId = "msg_test_signup";
    const signature = new Webhook(process.env.WEBHOOK_SECRET).sign(messageId, now, payload);
    const makeRequest = () => new Request("http://localhost/api/webhooks/clerk", { method: "POST", body: payload, headers: { "svix-id": messageId, "svix-timestamp": String(Math.floor(now.getTime() / 1000)), "svix-signature": signature } });
    assert.equal((await signup.POST(makeRequest())).status, 200);
    assert.equal((await signup.POST(makeRequest())).status, 200);
    assert.equal(await points(), 15);
  } finally { process.env.WEBHOOK_SECRET = original; }
});
