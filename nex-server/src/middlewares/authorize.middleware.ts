import type { NextFunction, Request, Response, RequestHandler } from "express";
import type { UserRole } from "../generated/prisma/enums.js";
import { AppError } from "../common/errors/app-error.js";

export function authorizeRoles(...allowedRoles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, "UNAUTHENTICATED", "Authentication is required."));

      return;
    }

    const currentRole = req.user.role as UserRole;

    if (!allowedRoles.includes(currentRole)) {
      next(
        new AppError(
          403,
          "FORBIDDEN",
          "You do not have permission to perform this action.",
        ),
      );

      return;
    }

    next();
  };
}
