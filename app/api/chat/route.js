import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Use the API key from .env.local
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY is missing. Fix your .env file, dude.");
}

const ai = new GoogleGenerativeAI({
  apiKey: apiKey,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Validate input to ensure it's not empty
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 }
      );
    }

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
    });

    const text = result.response.text;

    return NextResponse.json({ output: text });

  } catch (error) {
    console.error("[API ERROR]:", error);
    
    const errorMessage = error?.message || "Something went wrong.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
