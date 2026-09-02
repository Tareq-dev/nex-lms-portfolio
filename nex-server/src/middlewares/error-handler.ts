import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../common/errors/app-error.js";
import { sendError } from "../common/http/api-response.js";
import { env } from "../config/env.js";

type KnownError = {
  statusCode: number;
  code: string;
  message: string;
};

const knownErrors: Record<string, KnownError> = {
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    code: "EMAIL_ALREADY_EXISTS",
    message: "An account with this email already exists.",
  },

  INVALID_CREDENTIALS: {
    statusCode: 401,
    code: "INVALID_CREDENTIALS",
    message: "Email or password is incorrect.",
  },

  ACCOUNT_NOT_ACTIVE: {
    statusCode: 403,
    code: "ACCOUNT_NOT_ACTIVE",
    message: "This account is inactive or suspended.",
  },

  UNAUTHENTICATED: {
    statusCode: 401,
    code: "UNAUTHENTICATED",
    message: "Authentication is required.",
  },

  FORBIDDEN: {
    statusCode: 403,
    code: "FORBIDDEN",
    message: "You do not have permission to perform this action.",
  },

  INVALID_REFRESH_TOKEN: {
    statusCode: 401,
    code: "INVALID_REFRESH_TOKEN",
    message: "Refresh token is invalid or expired.",
  },

  INVALID_RESET_TOKEN: {
    statusCode: 400,
    code: "INVALID_RESET_TOKEN",
    message: "Password reset token is invalid or expired.",
  },

  CURRENT_PASSWORD_INCORRECT: {
    statusCode: 400,
    code: "CURRENT_PASSWORD_INCORRECT",
    message: "Current password is incorrect.",
  },

  NEW_PASSWORD_SAME_AS_OLD: {
    statusCode: 400,
    code: "NEW_PASSWORD_SAME_AS_OLD",
    message: "New password must be different.",
  },

  USER_NOT_FOUND: {
    statusCode: 404,
    code: "USER_NOT_FOUND",
    message: "User was not found.",
  },
};

export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    sendError(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      errors: error.errors,
    });

    return;
  }

  if (error instanceof ZodError) {
    sendError(res, {
      statusCode: 400,
      code: "VALIDATION_ERROR",
      message: "Validation failed.",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });

    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = String(error.meta?.target ?? "");

      const isEmailError = target.toLowerCase().includes("email");

      sendError(res, {
        statusCode: 409,
        code: "DUPLICATE_RESOURCE",
        message: isEmailError
          ? "An account with this email already exists."
          : "This record already exists.",
        errors: [
          {
            field: isEmailError ? "email" : "unknown",
            message: "This value is already being used.",
          },
        ],
      });

      return;
    }

    if (error.code === "P2025") {
      sendError(res, {
        statusCode: 404,
        code: "RESOURCE_NOT_FOUND",
        message: "The requested resource was not found.",
      });

      return;
    }

    if (error.code === "P2003") {
      sendError(res, {
        statusCode: 409,
        code: "FOREIGN_KEY_CONSTRAINT_FAILED",
        message: "This operation conflicts with another resource.",
      });

      return;
    }
  }

  if (error instanceof Error && knownErrors[error.message]) {
    sendError(res, knownErrors[error.message]);

    return;
  }

  if (env.NODE_ENV !== "test") {
    console.error(
      "Unexpected application error:",
      error,
    );
  }

  sendError(res, {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error.",
  });
};
