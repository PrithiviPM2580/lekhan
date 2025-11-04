export class APIError extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly error: string | { type: string; details?: ErrorDetail[] };

  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong",
    error: APIErrorType,
    stack?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
