// // import prisma from "../prismaClient.js";
// // import Joi from "joi";
// // import { generateCode } from "../services/gemini.service.js";

// // export const schema = Joi.object({
// //   prompt: Joi.string().min(1).max(2000).required(),
// //   languageId: Joi.number().integer().required(),
// // });

// // export const generateHandler = async (req, res, next) => {
// //   try {
// //     const { prompt, languageId } = req.body;

// //     // Validate that language exists
// //     const lang = await prisma.language.findUnique({
// //       where: { id: Number(languageId) },
// //     });

// //     if (!lang) {
// //       return res.status(400).json({ error: "Language not found" });
// //     }

// //     // Call OpenAI service
// //     const openaiResp = await generateCode(prompt, lang.name);

// //     // Save in DB
// //     const created = await prisma.generation.create({
// //       data: {
// //         prompt,
// //         code: openaiResp.code,
// //         modelName: openaiResp.modelName,
// //         tokensUsed: openaiResp.tokensUsed ?? null,
// //         languageId: lang.id,
// //         userId: req.user?.id ?? null,
// //       },
// //       include: {
// //         language: true,
// //       },
// //     });

// //     res.json({ generation: created });
// //   } catch (err) {
// //     next(err);
// //   }
// // };
// // In your generate.controller.js
// import { generateCode } from "../services/gemini.service.js";

// export async function generateHandler(req, res) {
//   try {
//     const { prompt, languageId } = req.body;
//     const language = await prisma.language.findUnique({
//       where: { id: languageId },
//     });
//     if (!language) return res.status(400).json({ error: "Language not found" });

//     const { code, tokensUsed, modelName } = await generateCode(
//       prompt,
//       language.name
//     );

//     const generation = await prisma.generation.create({
//       data: {
//         prompt,
//         code,
//         languageId,
//         modelName,
//         tokensUsed,
//       },
//       include: { language: true },
//     });

//     res.json({ generation });
//   } catch (error) {
//     console.error("Generate route error:", error);
//     res.status(500).json({ error: error.message || "Generation failed" });
//   }
// }
// src/controllers/generate.controller.js
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
