import type {
  Request,
  RequestHandler,
  Response,
} from "express";
import type { ZodType } from "zod";
import { AppError } from "../common/errors/app-error.js";

type ValidationTarget =
  | "body"
  | "params"
  | "query";

type RequestSchemas = Partial<
  Record<ValidationTarget, ZodType>
>;

type ValidatedData = Partial<
  Record<ValidationTarget, unknown>
>;

export function validateRequest(
  schemas: RequestSchemas,
): RequestHandler {
  return (req, res, next) => {
    async function validate():
      Promise<void> {
      const validated: ValidatedData = {};

      const entries = Object.entries(
        schemas,
      ) as Array<
        [ValidationTarget, ZodType]
      >;

      for (const [target, schema] of entries) {
        const result =
          await schema.safeParseAsync(
            req[target],
          );

        if (!result.success) {
          throw new AppError(
            400,
            "VALIDATION_ERROR",
            "Validation failed.",
            result.error.issues.map(
              (issue) => ({
                field:
                  issue.path.join(".") ||
                  target,
                message: issue.message,
              }),
            ),
          );
        }

        validated[target] = result.data;

        if (target === "body") {
          req.body = result.data;
        }

        if (target === "params") {
          req.params =
            result.data as Record<
              string,
              string
            >;
        }
      }

      res.locals.validated = validated;
    }

    void validate()
      .then(() => next())
      .catch(next);
  };
}

export function getValidated<T>(
  res: Response,
  target: ValidationTarget,
): T {
  const validated =
    res.locals.validated as
      | ValidatedData
      | undefined;

  const value = validated?.[target];

  if (value === undefined) {
    throw new Error(
      `Validated ${target} is missing.`,
    );
  }

  return value as T;
}