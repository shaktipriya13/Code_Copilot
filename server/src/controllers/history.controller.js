import prisma from "../prismaClient.js";

/**
 * GET /api/history?page=1&limit=10
 * returns { data, page, limit, total }
 */
export const historyHandler = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    // Optional: filter per user
    // const where = req.user ? { userId: req.user.id } : {}

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
