import type { RequestHandler } from "express";
import { AppError } from "../common/errors/app-error.js";

export const notFoundHandler:
  RequestHandler = (req, _res, next) => {
    next(
      new AppError(
        404,
        "ENDPOINT_NOT_FOUND",
        `Endpoint ${req.method} ${req.originalUrl} was not found.`,
      ),
    );
  };