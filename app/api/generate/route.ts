// 👇 PASTE THIS LINE AT THE VERY TOP
export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Use environment variable (do NOT hardcode key)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { topic, level } = await req.json();

    // Replace your existing model initialization with this:
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Act as an expert course creator. Create a 3-module ${level} level course on the topic: "${topic}".
For each module, include at least 3 specific sub-lessons.
Return strictly as JSON:
{
  "title": "Course Title",
  "modules": [
    {
      "name": "Module Name",
      "lessons": ["Lesson 1", "Lesson 2", "Lesson 3"]
    }
  ]
}`;

    const result = await model?.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json|```/g, "").trim();

    // ✅ Safe JSON parsing
    try {
      return NextResponse.json(JSON.parse(cleanedText));
    } catch {
      console.error("JSON parse failed:", cleanedText);
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
