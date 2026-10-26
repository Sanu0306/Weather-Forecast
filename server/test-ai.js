import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {
  console.log("Testing Gemini...");

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: "Reply with only: Hello",
  });

  console.log("Gemini says:", response.text);
} catch (error) {
  console.error("Gemini test failed:", error);
}
