import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const signToken = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      req.user = null;
      return next();
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
