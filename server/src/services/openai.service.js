const axios = require("axios");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is not set");
}

/**
 * generateCode(prompt, languageName)
 * Returns { code, tokensUsed, modelName }
 */
async function generateCode(prompt, languageName, model = "gpt-4o") {
  // Minimal chat request
  const systemPrompt = `You are a helpful code assistant. When asked to generate code, return only the code block (no surrounding explanation). Use ${languageName} syntax.`;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.0,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const choice = response.data.choices?.[0];
    const text = choice?.message?.content ?? "";
    const tokens = response.data.usage?.total_tokens ?? null;
    return { code: text, tokensUsed: tokens, modelName: model };
  } catch (err) {
    // Re-throw a cleaned up error
    const message =
      err?.response?.data || err.message || "OpenAI request failed";
    throw new Error(JSON.stringify(message));
  }
}

module.exports = { generateCode };
