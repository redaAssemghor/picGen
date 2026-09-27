export const MODELS = {
  "z-image": { id: "Tongyi-MAI/Z-Image-Turbo", name: "Z-Image Turbo", description: "Detailed, expressive images" },
  "flux": { id: "black-forest-labs/FLUX.1-schnell", name: "FLUX.1 Schnell", description: "Fast creative exploration" },
} as const;
export const RATIOS = {
  "1:1": { width: 1024, height: 1024, label: "Square" },
  "4:3": { width: 1024, height: 768, label: "Landscape" },
  "3:4": { width: 768, height: 1024, label: "Portrait" },
} as const;
export const STYLES = {
  none: { name: "Natural", prompt: "" },
  cinematic: { name: "Cinematic", prompt: "cinematic composition, atmospheric lighting, film still" },
  photography: { name: "Photography", prompt: "editorial photography, natural light, realistic textures" },
  illustration: { name: "Illustration", prompt: "editorial illustration, expressive shapes, thoughtful color palette" },
  "3d": { name: "3D render", prompt: "3D render, soft studio lighting, tactile materials" },
} as const;
export const CREDIT_COST = 5;
export const STARTER_CREDITS = 50;
export const INSPIRATION = [
  "A tiny glass greenhouse on the moon, wildflowers inside, soft earthlight, editorial photography",
  "An orange floating above a cobalt blue pedestal, hard afternoon shadows, playful product photography",
  "A quiet bookshop inside an ancient tree, warm lamps, watercolor illustration, intricate details",
  "A sculptural coastal house at golden hour, pale stone, olive trees, cinematic wide shot",
  "A chrome butterfly resting on lavender silk, macro photography, soft studio light",
];
export type GenerationInput = { requestId: string; prompt: string; model: keyof typeof MODELS; ratio: keyof typeof RATIOS; style: keyof typeof STYLES; seed: number };
export function parseGeneration(value: unknown): GenerationInput {
  if (!value || typeof value !== "object") throw new Error("Enter a prompt and choose your settings.");
  const data = value as Record<string, unknown>;
  if (typeof data.requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) throw new Error("Invalid request ID. Please try again.");
  if (typeof data.prompt !== "string" || data.prompt.trim().length < 3 || data.prompt.trim().length > 1500) throw new Error("Use a prompt between 3 and 1,500 characters.");
  if (typeof data.model !== "string" || !Object.hasOwn(MODELS, data.model)) throw new Error("Choose an available model.");
  if (typeof data.ratio !== "string" || !Object.hasOwn(RATIOS, data.ratio)) throw new Error("Choose an available aspect ratio.");
  if (typeof data.style !== "string" || !Object.hasOwn(STYLES, data.style)) throw new Error("Choose an available style.");
  if (!Number.isInteger(data.seed) || Number(data.seed) < 0 || Number(data.seed) > 2147483647) throw new Error("Seed must be an integer from 0 to 2,147,483,647.");
  return { ...data, prompt: data.prompt.trim() } as GenerationInput;
}
export function modelPrompt(input: GenerationInput) {
  return [input.prompt, STYLES[input.style].prompt].filter(Boolean).join(", ");
}
export type Creation = { id: string; prompt: string; model: string; ratio: string; style: string; seed: number; favorite: boolean; createdAt: string };
