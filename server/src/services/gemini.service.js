// // src/services/gemini.service.js
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// if (!GEMINI_API_KEY) {
//   throw new Error("❌ GEMINI_API_KEY not set in .env");
// }

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // ✅ Current fast & cheap model as of November 2025
// const MODEL_NAME = "gemini-2.5-flash";
// // Alternative options:
// // "gemini-2.5-flash"   ← newest, best price/performance
// // "gemini-2.0-flash"   ← slightly older but still excellent
// // "gemini-2.5-pro"     ← more powerful (costs more)

// export async function generateCode(prompt, languageName) {
//   const model = genAI.getGenerativeModel({
//     model: MODEL_NAME,
//     systemInstruction: `You are a helpful programming assistant.
// Output ONLY ${languageName} code.
// If you must add explanations, put them in comments.
// Never use markdown code fences (no \`\`\`).`,
//   });

//   const fullPrompt = `User request:\n${prompt}`;

//   try {
//     console.log(`🔥 Calling ${MODEL_NAME}...`);
//     const result = await model.generateContent(fullPrompt);

//     // Current safe way to extract text (2025+ SDK)
//     const code = result.response.text()?.trim() ?? "";

//     if (!code) {
//       throw new Error("Empty response from Gemini");
//     }

//     return { code, tokensUsed: null, modelName: MODEL_NAME };
//   } catch (err) {
//     console.error("Gemini error:", err.message || err);
//     throw new Error(`Gemini request failed: ${err.message}`);
//   }
// }

// src/services/gemini.service.js
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
