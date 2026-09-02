export type ErrorDetail = {
  field?: string;
  message: string;
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors: ErrorDetail[];

  constructor(
    statusCode: number,
    code: string,
    message: string,
    errors: ErrorDetail[] = [],
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;

    Object.setPrototypeOf(
      this,
      AppError.prototype,
    );
  }
}