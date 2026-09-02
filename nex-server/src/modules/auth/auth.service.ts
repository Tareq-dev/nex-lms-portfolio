import { UserStatus } from "../../generated/prisma/enums.js";
import {
  getFrontendUrl,
  getPasswordResetExpiresAt,
  getRefreshTokenExpiresAt,
} from "../../config/auth.config.js";
import { prisma } from "../../lib/prisma.js";
import { sendPasswordResetEmail } from "../../lib/email.js";
import { generateAccessToken } from "../../utils/jwt.js";
import {
  generateOpaqueToken,
  hashOpaqueToken,
} from "../../utils/random-token.js";
import {
  hashPassword,
  verifyPassword,
} from "../../utils/password.js";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "./auth.validation.js";

const safeAuthUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  avatarUrl: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
  authVersion: true,
} as const;

function createAccessTokenForUser(user: {
  id: string;
  role: string;
  authVersion: number;
}) {
  return generateAccessToken({
    userId: user.id,
    role: user.role,
    authVersion: user.authVersion,
  });
}

function removePrivateAuthFields<
  T extends {
    authVersion: number;
  },
>(user: T) {
  const {
    authVersion: _authVersion,
    ...safeUser
  } = user;

  return safeUser;
}

async function createRefreshSession(
  userId: string,
) {
  const refreshToken =
    generateOpaqueToken();

  await prisma.refreshSession.create({
    data: {
      userId,
      tokenHash:
        hashOpaqueToken(refreshToken),
      expiresAt:
        getRefreshTokenExpiresAt(),
    },
  });

  return refreshToken;
}

export async function registerUser(
  input: RegisterInput,
) {
  // const existingUser =
  //   await prisma.user.findUnique({
  //     where: {
  //       email: input.email,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });

  // if (existingUser) {
  //   throw new Error(
  //     "EMAIL_ALREADY_EXISTS",
  //   );
  // }

  const passwordHash =
    await hashPassword(input.password);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function loginUser(
  input: LoginInput,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        ...safeAuthUserSelect,
        passwordHash: true,
      },
    });

  if (!user) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  const isPasswordCorrect =
    await verifyPassword(
      user.passwordHash,
      input.password,
    );

  if (!isPasswordCorrect) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  // Suspended/Inactive user login বন্ধ
  if (user.status !== UserStatus.ACTIVE) {
    throw new Error(
      "ACCOUNT_NOT_ACTIVE",
    );
  }

  const accessToken =
    createAccessTokenForUser(user);

  const refreshToken =
    await createRefreshSession(user.id);

  const {
    passwordHash: _passwordHash,
    ...userWithoutPassword
  } = user;

  return {
    user: removePrivateAuthFields(
      userWithoutPassword,
    ),
    accessToken,
    refreshToken,
  };
}

export async function refreshAuthentication(
  rawRefreshToken: string,
) {
  const currentTokenHash =
    hashOpaqueToken(rawRefreshToken);

  const session =
    await prisma.refreshSession.findUnique({
      where: {
        tokenHash: currentTokenHash,
      },
      select: {
        id: true,
        tokenHash: true,
        expiresAt: true,
        revokedAt: true,

        user: {
          select: safeAuthUserSelect,
        },
      },
    });

  const now = new Date();

  if (
    !session ||
    session.revokedAt ||
    session.expiresAt <= now
  ) {
    throw new Error(
      "INVALID_REFRESH_TOKEN",
    );
  }

  if (
    session.user.status !==
    UserStatus.ACTIVE
  ) {
    await prisma.refreshSession.updateMany({
      where: {
        id: session.id,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });

    throw new Error(
      "ACCOUNT_NOT_ACTIVE",
    );
  }

  const newRefreshToken =
    generateOpaqueToken();

  const newTokenHash =
    hashOpaqueToken(newRefreshToken);

  const accessToken =
    createAccessTokenForUser(
      session.user,
    );

  // একই refresh token একবারই rotate হবে
  const rotationResult =
    await prisma.refreshSession.updateMany({
      where: {
        id: session.id,
        tokenHash: currentTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
      data: {
        tokenHash: newTokenHash,
        expiresAt:
          getRefreshTokenExpiresAt(),
      },
    });

  if (rotationResult.count !== 1) {
    throw new Error(
      "INVALID_REFRESH_TOKEN",
    );
  }

  return {
    user: removePrivateAuthFields(
      session.user,
    ),
    accessToken,
    refreshToken: newRefreshToken,
  };
}

export async function revokeRefreshSession(
  rawRefreshToken?: string,
) {
  if (!rawRefreshToken) {
    return;
  }

  await prisma.refreshSession.updateMany({
    where: {
      tokenHash:
        hashOpaqueToken(
          rawRefreshToken,
        ),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function requestPasswordReset(
  input: ForgotPasswordInput,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        email: input.email,
      },
      select: {
        id: true,
        email: true,
      },
    });

  // Email না থাকলেও error প্রকাশ করা হবে না
  if (!user) {
    return;
  }

  const resetToken =
    generateOpaqueToken();

  const resetTokenHash =
    hashOpaqueToken(resetToken);

  // আগের unused reset token মুছে দেওয়া
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      usedAt: null,
    },
  });

  const resetRecord =
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: resetTokenHash,
        expiresAt:
          getPasswordResetExpiresAt(),
      },
      select: {
        id: true,
      },
    });

  const resetUrl =
    `${getFrontendUrl()}` +
    `/reset-password?token=` +
    encodeURIComponent(resetToken);

  // Local development test
  if (
    process.env.NODE_ENV !== "production"
  ) {
    console.log(
      "Development password reset URL:",
      resetUrl,
    );

    return;
  }

  try {
    await sendPasswordResetEmail(
      user.email,
      resetUrl,
    );
  } catch (error: unknown) {
    // Email না গেলে unusable token সরিয়ে দিচ্ছি
    await prisma.passwordResetToken.delete({
      where: {
        id: resetRecord.id,
      },
    });

    console.error(
      "Password reset email failed:",
      error,
    );
  }
}

export async function resetPasswordWithToken(
  input: ResetPasswordInput,
) {
  const tokenHash =
    hashOpaqueToken(input.token);

  const resetRecord =
    await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
      },
    });

  if (
    !resetRecord ||
    resetRecord.usedAt ||
    resetRecord.expiresAt <= new Date()
  ) {
    throw new Error(
      "INVALID_RESET_TOKEN",
    );
  }

  const passwordHash =
    await hashPassword(
      input.newPassword,
    );

  const now = new Date();

  await prisma.$transaction(
    async (transaction) => {
      const claimResult =
        await transaction.passwordResetToken.updateMany({
          where: {
            id: resetRecord.id,
            usedAt: null,
            expiresAt: {
              gt: now,
            },
          },
          data: {
            usedAt: now,
          },
        });

      if (claimResult.count !== 1) {
        throw new Error(
          "INVALID_RESET_TOKEN",
        );
      }

      await transaction.user.update({
        where: {
          id: resetRecord.userId,
        },
        data: {
          passwordHash,

          // পুরোনো access tokens বাতিল
          authVersion: {
            increment: 1,
          },
        },
      });

      // সব device-এর refresh session revoke
      await transaction.refreshSession.updateMany({
        where: {
          userId: resetRecord.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: now,
        },
      });

      // অন্য reset tokens মুছে দেওয়া
      await transaction.passwordResetToken.deleteMany({
        where: {
          userId: resetRecord.userId,
          id: {
            not: resetRecord.id,
          },
          usedAt: null,
        },
      });
    },
  );
}

export async function changeUserPassword(
  userId: string,
  input: ChangePasswordInput,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND",
    );
  }

  const currentPasswordIsCorrect =
    await verifyPassword(
      user.passwordHash,
      input.currentPassword,
    );

  if (!currentPasswordIsCorrect) {
    throw new Error(
      "CURRENT_PASSWORD_INCORRECT",
    );
  }

  const newPasswordIsSame =
    await verifyPassword(
      user.passwordHash,
      input.newPassword,
    );

  if (newPasswordIsSame) {
    throw new Error(
      "NEW_PASSWORD_SAME_AS_OLD",
    );
  }

  const passwordHash =
    await hashPassword(
      input.newPassword,
    );

  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,

        // Current এবং পুরোনো access token invalid
        authVersion: {
          increment: 1,
        },
      },
    }),

    prisma.refreshSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    }),

    prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    }),
  ]);
}