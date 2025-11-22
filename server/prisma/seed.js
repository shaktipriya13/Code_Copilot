import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding languages and demo user...");

  const langs = [
    { name: "Python", slug: "python", extension: "py" },
    { name: "JavaScript", slug: "javascript", extension: "js" },
    { name: "C++", slug: "cpp", extension: "cpp" },
    { name: "Java", slug: "java", extension: "java" },
  ];

  for (const lang of langs) {
    await prisma.language.upsert({
      where: { slug: lang.slug },
      update: {},
      create: lang,
    });
  }

  // Demo user: demo1234
  const email = "demo@codecopilot.local";
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hashed = await bcrypt.hash("demo1234", 10);
    await prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });

    console.log("Created demo user: demo@codecopilot.local / demo1234");
  }

  console.log("Seeding complete.");
}

main()
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
