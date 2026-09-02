import "dotenv/config";
import { createInterface } from "node:readline/promises";
import {
  stdin as input,
  stdout as output,
} from "node:process";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/password.js";

async function main() {
  const email = process.argv[2]
    ?.trim()
    .toLowerCase();

  if (!email) {
    throw new Error(
      "Please provide the user's email address.",
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

  if (!existingUser) {
    throw new Error(
      `No user was found with email: ${email}`,
    );
  }

  const readline = createInterface({
    input,
    output,
  });

  try {
    const newPassword = await readline.question(
      "Enter new password: ",
    );

    const confirmPassword =
      await readline.question(
        "Confirm new password: ",
      );

    if (newPassword !== confirmPassword) {
      throw new Error(
        "The passwords do not match.",
      );
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 128
    ) {
      throw new Error(
        "Password must contain between 8 and 128 characters.",
      );
    }

    const passwordHash =
      await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        passwordHash,
      },
    });

    console.log(
      `Password reset successfully for ${existingUser.email}`,
    );
  } finally {
    readline.close();
  }
}

main()
  .catch((error: unknown) => {
    console.error(
      "Password reset failed:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });