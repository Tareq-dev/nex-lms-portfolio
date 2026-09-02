import { env } from "../src/config/env.js";
import { prisma } from "../src/lib/prisma.js";

export async function cleanTestDatabase(): Promise<void> {
  if (!env.DATABASE_URL.includes("nex_lms_test")) {
    throw new Error(
      "Test stopped: DATABASE_URL is not pointing to nex_lms_test.",
    );
  }

  await prisma.passwordResetToken.deleteMany();

  await prisma.refreshSession.deleteMany();
  await prisma.paymentAttempt.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.enrollment.deleteMany();

  await prisma.chapter.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  await prisma.category.deleteMany();
}
