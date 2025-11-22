import prisma from "../prismaClient.js";

export const historyHandler = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [total, generations] = await Promise.all([
      prisma.generation.count(),
      prisma.generation.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          language: true,
          user: { select: { id: true, email: true } },
        },
      }),
    ]);

    res.json({ data: generations, page, limit, total });
  } catch (err) {
    next(err);
  }
};
