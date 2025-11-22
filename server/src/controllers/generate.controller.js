import { PrismaClient } from "@prisma/client";
import { generateCode } from "../services/gemini.service.js";

const prisma = new PrismaClient();

export async function generateHandler(req, res) {
  try {
    const { prompt, languageId } = req.body;

    if (!prompt || !languageId) {
      return res.status(400).json({ error: "Missing prompt or languageId" });
    }

    const language = await prisma.language.findUnique({
      where: { id: Number(languageId) },
    });

    if (!language) {
      return res.status(400).json({ error: "Invalid languageId" });
    }

    const { code, tokensUsed, modelName } = await generateCode(
      prompt,
      language.name
    );

    const generation = await prisma.generation.create({
      data: {
        prompt,
        code,
        languageId: Number(languageId),
        modelName,
        tokensUsed,
      },
      include: { language: true },
    });

    res.json({ generation });
  } catch (error) {
    console.error("Generate route error:", error);
    res.status(500).json({ error: error.message || "Generation failed" });
  }
}
