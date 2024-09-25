import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not defined. Please set it in your environment variables."
  );
}
const gemini = new GoogleGenerativeAI(apiKey);

export async function POST() {
  try {
    const prompt =
      "Give a creative, five-word description of an imaginary scene:";

    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const response = result.response.text();
    console.log(response);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error during text generation:", error);

    return NextResponse.json(
      { error: "Failed to generate text. Please try again later." },
      { status: 500 }
    );
  }
}
