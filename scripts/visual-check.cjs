const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const fs = require("node:fs");
const path = require("node:path");
let browser;
const base = process.env.PICGEN_TEST_URL || "http://localhost:3000";
(async () => {
  browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Get started", exact: true }).waitFor({ state: "visible" });
  const output = path.join(process.cwd(), ".tmp"); fs.mkdirSync(output, { recursive: true });
  for (const route of ["/", "/generatepage", "/pricing", "/images"]) {
    await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });
    await page.screenshot({ path: path.join(output, (route === "/" ? "home" : route.slice(1)) + "-desktop.png"), fullPage: true });
    console.log(JSON.stringify({ route, title: await page.title(), heading: await page.locator("h1,h2").first().innerText(), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors: errors.splice(0) }));
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/generatepage", "/pricing", "/images"]) {
    await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });
    await page.screenshot({ path: path.join(output, (route === "/" ? "home" : route.slice(1)) + "-mobile.png"), fullPage: true });
    console.log(JSON.stringify({ mobile: route, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors: errors.splice(0) }));
  }
  await page.goto(base);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("link", { name: "Create", exact: true }).click();
  await page.waitForURL("**/generatepage");
  console.log("Mobile navigation passed.");
  await page.goto(base);
  await page.getByLabel("Describe your first image").fill("A tiny lavender planet");
  await page.getByRole("button", { name: "Create this image" }).click();
  await page.waitForURL("**/generatepage?prompt=*");
  await page.waitForFunction(() => document.getElementById("studio-prompt")?.value === "A tiny lavender planet");
  console.log("Hero prompt handoff passed.");
  await browser.close();
})().catch(async error => { console.error(error.message); await browser?.close(); process.exitCode = 1; });
