import { logRequest } from "utils/index.utils.js";
import { Request, Response, NextFunction } from "express";
import { APIError } from "utils/index.utils.js";
import {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken";

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;

  let customError: APIError;

  if (err instanceof JsonWebTokenError) {
    logRequest({
      req,
      message: "JWT Error occurred",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Invalid token. Please log in again.",
      "JsonWebTokenError",
      err.stack
    );
  } else if (err instanceof TokenExpiredError) {
    logRequest({
      req,
      message: "JWT Token Expired",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Your token has expired. Please log in again.",
      "TokenExpiredError",
      err.stack
    );
  } else if (err instanceof NotBeforeError) {
    logRequest({
      req,
      message: "JWT Not Before Error",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Token not active. Please try again later.",
      "NotBeforeError",
      err.stack
    );
  } else if (err instanceof APIError) {
    logRequest({
      req,
      res,
      message: "API Error occurred",
      error: err.message,
    });
    customError = err;
  } else {
    const unknownError = err as Error;
    logRequest({
      req,
      res,
      message: "An unknown error occurred",
      error: unknownError.message,
    });
    customError = new APIError(
      500,
      unknownError.message || "Something went wrong",
      "InternalServerError",
      unknownError.stack
    );
  }

  logRequest({
    req,
    res,
    message: "Sending error response",
    error: customError.message,
  });

  res.status(customError.statusCode).json({
    success: customError.success,
    statusCode: customError.statusCode,
    message: customError.message,
    error: customError.error,
  });
};

export default globalErrorHandler;
