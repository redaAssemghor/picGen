import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Define the route handler for POST requests
export async function POST() {
  const prompt = "Write a story about a magic backpack.";

  try {
    // Ensure the API key is available
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY environment variable" },
        { status: 500 }
      );
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Call the model to generate content based on the prompt
    const result = await model.generateContent(prompt);

    // Parse and send the response
    const story = await result.response.text(); // Ensure the text is awaited properly
    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error generating content:", error);

    // Return an error response in case of any failure
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
