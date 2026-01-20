export const runtime = "nodejs";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const { topic, level } = await req.json();

    if (!topic || !level) {
      return NextResponse.json(
        { error: "Topic or level missing" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Act as an expert course creator.
Create a 3-module ${level} level course on "${topic}".

Return ONLY valid JSON in this format:
{
  "title": "Course Title",
  "modules": [
    {
      "name": "Module Name",
      "lessons": ["Lesson 1", "Lesson 2", "Lesson 3"]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("Gemini raw response:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON from Gemini");
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error: any) {
    console.error("API ERROR:", error.message);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

