import type { Response } from "express";
import type {
  ErrorDetail,
} from "../errors/app-error.js";

type SuccessOptions<T> = {
  statusCode?: number;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

export function sendSuccess<T>(
  res: Response,
  options: SuccessOptions<T>,
): Response {
  const {
    statusCode = 200,
    message,
    data = null,
    meta,
  } = options;

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

type ErrorOptions = {
  statusCode: number;
  code: string;
  message: string;
  errors?: ErrorDetail[];
};

export function sendError(
  res: Response,
  options: ErrorOptions,
): Response {
  return res
    .status(options.statusCode)
    .json({
      success: false,
      code: options.code,
      message: options.message,
      data: null,
      errors: options.errors ?? [],
    });
}