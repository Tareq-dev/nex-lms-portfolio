import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { UserStatus } from "../generated/prisma/enums.js";
import { ACCESS_TOKEN_COOKIE_NAME } from "../config/cookie.js";
import { prisma } from "../lib/prisma.js";
import {
  verifyAccessToken,
  type AccessTokenPayload,
} from "../utils/jwt.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token: unknown =
    req.cookies?.[
      ACCESS_TOKEN_COOKIE_NAME
    ];

  if (
    typeof token !== "string" ||
    !token
  ) {
    res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });

    return;
  }

  let tokenPayload: AccessTokenPayload;

  try {
    tokenPayload =
      verifyAccessToken(token);
  } catch {
    res.status(401).json({
      success: false,
      message:
        "Your session is invalid or has expired.",
    });

    return;
  }

  try {
    const user =
      await prisma.user.findUnique({
        where: {
          id: tokenPayload.userId,
        },
        select: {
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
        },
      });

    if (!user) {
      res.status(401).json({
        success: false,
        message:
          "The user associated with this session no longer exists.",
      });

      return;
    }

    // Suspended user protected route ব্যবহার করতে পারবে না
    if (
      user.status !== UserStatus.ACTIVE
    ) {
      res.status(403).json({
        success: false,
        message:
          "Your account is not active.",
      });

      return;
    }

    // Password change/reset-এর পর পুরোনো JWT invalid
    if (
      tokenPayload.authVersion !==
      user.authVersion
    ) {
      res.status(401).json({
        success: false,
        message:
          "Your session is invalid or has expired.",
      });

      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      emailVerifiedAt:
        user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (error: unknown) {
    console.error(
      "Authentication database check failed:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}