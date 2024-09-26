import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
  const prompt =
    "Write a short description of an image you imagine of a surreal fantasy world.";

  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY environment variable" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    const story = result.response.text();
    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error generating content:", error);

    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
