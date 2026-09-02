import "dotenv/config";
import { UserRole } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";

async function main() {
  const email = process.argv[2]
    ?.trim()
    .toLowerCase();

  if (!email) {
    throw new Error(
      "Provide an email address. Example: npx tsx src/scripts/make-super-admin.ts tareq@example.com",
    );
  }

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      role: UserRole.SUPER_ADMIN,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  console.log("Super Admin created:", user);
}

main()
  .catch((error: unknown) => {
    console.error(
      "Failed to create Super Admin:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });