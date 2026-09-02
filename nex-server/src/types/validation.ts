export type ValidationTarget =
  | "body"
  | "params"
  | "query";

declare global {
  namespace Express {
    interface Request {
      validated?: Partial<
        Record<ValidationTarget, unknown>
      >;
    }
  }
}

export {};