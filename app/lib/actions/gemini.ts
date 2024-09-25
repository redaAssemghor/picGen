import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiAction = async () => {
  const prompt = "Write a story about a magic backpack.";

  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  }
};
