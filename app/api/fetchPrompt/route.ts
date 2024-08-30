import { NextResponse } from "next/server";
import OpenAI from "openai";
const openai = new OpenAI();

export async function POST() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "Give a creative, five-word description of an imaginary scene with an animale or human:",
        },
      ],
    });
    const generatedText = completion.choices[0].message.content;

    return NextResponse.json(generatedText);
  } catch (error) {
    console.error("Error during text generation:", error); // Log the error details

    return NextResponse.json(
      { error: "Failed to fetch image", details: error },
      { status: 500 }
    );
  }
}
