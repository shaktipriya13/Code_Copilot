import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing or empty!");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const MODEL_NAME = "gemini-2.5-flash"; // ← confirmed working Nov 2025

export async function generateCode(prompt, languageName) {
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: `You are a expert programmer. Output ONLY ${languageName} code. Never use markdown fences. Never add explanations outside comments.`,
  });

  try {
    const result = await model.generateContent(prompt); // simple string works perfectly
    const code = result.response.text()?.trim();

    if (!code) throw new Error("Empty response from Gemini");

    return {
      code,
      tokensUsed: result.response.usageMetadata?.totalTokenCount || null,
      modelName: MODEL_NAME,
    };
  } catch (error) {
    console.error("Gemini failed:", error.message);
    // Re-throw so Express can catch it
    throw new Error(error.message || "Gemini generation failed");
  }
}
