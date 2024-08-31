import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "a white sphynx cat",
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data[0].url;

    console.log("server:", image_url);
    return NextResponse.json({ image_url });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
