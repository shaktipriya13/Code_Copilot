import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient({ log: ["query", "warn"] });

export default prisma;
