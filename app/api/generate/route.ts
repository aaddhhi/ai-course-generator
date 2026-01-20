import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// We use the variable name GEMINI_API_KEY here, NOT the actual key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // We now extract both 'topic' and 'level' from the request
    const { topic, level } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // This prompt now uses the 'level' to make the course adaptive
   const prompt = `Act as an expert course creator. Create a 3-module ${level} level course on the topic: "${topic}". 
For each module, include at least 3 specific sub-lessons.
Return strictly as JSON:
{
  "title": "Course Title",
  "modules": [
    { 
      "name": "Module Name", 
      "lessons": ["Lesson 1 Title", "Lesson 2 Title", "Lesson 3 Title"] 
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Cleaning the response to ensure valid JSON
    const cleanedText = text.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate course" }, { status: 500 });
  }
}