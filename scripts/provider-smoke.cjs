const fs = require("node:fs");
const path = require("node:path");
const { InferenceClient } = require("@huggingface/inference");
const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
(async () => {
  process.stdout.write("Starting provider smoke test.\n");
  const timer = setInterval(() => {}, 1000);
  const client = new InferenceClient(process.env.HF_ACCESS_TOKEN);
  try {
    const image = await client.textToImage({ model: process.argv[2] === "flux" ? "black-forest-labs/FLUX.1-schnell" : "Tongyi-MAI/Z-Image-Turbo", provider: "fal-ai", inputs: "An elegant sculptural lavender glass vase on warm ivory stone, editorial product photography, soft daylight, no text", parameters: { image_size: { width: 768, height: 1024 }, seed: 42, num_images: 1, output_format: "png" } }, { signal: AbortSignal.timeout(90000), retry_on_error: false });
    const directory = path.join(process.cwd(), ".tmp");
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, "provider-smoke." + (image.type === "image/jpeg" ? "jpg" : "png")), Buffer.from(await image.arrayBuffer()));
    process.stdout.write(JSON.stringify({ ok: true, type: image.type, bytes: image.size }));
  } catch (error) {
    const message = String(error.message).replace(/hf_[a-zA-Z0-9]+/g, "[redacted]");
    process.stdout.write(JSON.stringify({ ok: false, name: error.name, message: message.slice(0, 700) }));
    process.exitCode = 1;
  } finally { clearInterval(timer); }
})();
