// import { NextResponse } from "next/server";
// import OpenAI from "openai";
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST() {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//           role: "user",
//           content:
//             "Give a creative, five-word description of an imaginary scene:",
//         },
//       ],
//     });
//     const generatedText = completion.choices[0].message.content;

//     return NextResponse.json(generatedText);
//   } catch (error) {
//     console.error("Error during text generation:", error); // Log the error details

//     return NextResponse.json(
//       { error: "Failed to fetch image", details: error },
//       { status: 500 }
//     );
//   }
// }

import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export async function POST() {
  try {
    const out = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "user",
          content:
            "Give a creative, five-word description of an imaginary scene:",
        },
      ],
      max_tokens: 100,
    });
    const response = out.choices[0].message.content;
    console.log(response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error during text generation:", error);
  }
}
