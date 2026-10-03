import { validateJsonMutation } from "@/lib/request";
import { auth } from "@clerk/nextjs/server";
import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";
import { MODELS, RATIOS, modelPrompt, parseGeneration } from "@/lib/generation";
import prisma from "@/app/lib/prisma";
import { ensureAccount } from "@/app/lib/account";
import { CreditError, recoverExpired, refund, reserve } from "@/app/lib/credits";

export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  const invalid = validateJsonMutation(request); if (invalid) return invalid;
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Sign in to create images." }, { status: 401 });
  if (!process.env.HF_ACCESS_TOKEN) return NextResponse.json({ error: "Image generation is not configured yet." }, { status: 503 });
  let input;
  try {
    const body = await request.text();
    if (body.length > 8000) throw new Error("Request is too large.");
    input = parseGeneration(JSON.parse(body));
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? "Invalid request." : (error as Error).message }, { status: 400 });
  }
  let reserved = false;
  try {
    await ensureAccount(userId);
    await recoverExpired(userId);
    const job = await reserve(userId, input);
    if (job.status !== "completed") {
      reserved = true;
      const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);
      const blob = await client.textToImage({
        model: MODELS[input.model].id,
        provider: "fal-ai",
        inputs: modelPrompt(input),
        parameters: { image_size: { width: RATIOS[input.ratio].width, height: RATIOS[input.ratio].height }, seed: input.seed, num_images: 1, output_format: "png" },
      }, { signal: AbortSignal.timeout(55_000), retry_on_error: false });
      if (!["image/png", "image/jpeg", "image/webp"].includes(blob.type) || blob.size > 8 * 1024 * 1024 || !blob.size) throw new Error("Invalid provider image.");
      const data = Buffer.from(await blob.arrayBuffer()).toString("base64");
      const updated = await prisma.generation.updateMany({ where: { id: input.requestId, userId, status: "pending" }, data: { image: data, mimeType: blob.type, status: "completed" } });
      if (!updated.count) throw new Error("Generation expired.");
      reserved = false;
    }
    const balance = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } }).catch(() => null);
    return NextResponse.json({ id: input.requestId, points: balance?.points }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (reserved) {
      try { await refund(input.requestId, userId); }
      catch { return NextResponse.json({ error: "Generation failed. Your credit refund will be recovered automatically when you revisit the studio after five minutes." }, { status: 503 }); }
    }
    if (error instanceof CreditError) return NextResponse.json({ error: error.message }, { status: error.status });
    // Never return provider responses, credentials, or database details to the browser.
    return NextResponse.json({ error: "Generation is unavailable. No credits were charged. Please retry shortly." }, { status: 503 });
  }
}
