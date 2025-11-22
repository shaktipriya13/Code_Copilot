import prisma from "../prismaClient.js";

export const listLanguages = async (req, res, next) => {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { name: "asc" },
    });

    res.json({ languages });
  } catch (err) {
    next(err);
  }
};
