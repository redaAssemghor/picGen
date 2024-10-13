import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

// const model = "stabilityai/stable-diffusion-2";
const model = "CompVis/stable-diffusion-v1-4";

export async function POST(request: Request) {
  try {
    const { prompt, negative_prompt } = await request.json();
    // Call Hugging Face API to generate image
    const response = await hf.textToImage({
      model,
      inputs: prompt,
      parameters: {
        negative_prompt: negative_prompt || "ugly, blurry, poor quality",
      },
    });
    const imageBuffer = await response.arrayBuffer();

    // Send image as response
    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    // Handle error
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
