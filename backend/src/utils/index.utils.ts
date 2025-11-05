import logger from "lib/logger.lib.js";
import type { Response, Request } from "express";

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

export const logRequest = ({ req, res, message, data, error }: LogOptions) => {
  const start = req.startTime || Date.now();
  const responseTime = `${Date.now() - start}ms`;

  const meta: Record<string, unknown> = {
    method: req.method,
    url: req.originalUrl,
    baseYrl: req.baseUrl || "",
    ip: req.ip || req.socket.remoteAddress,
    statusCode: res?.statusCode || null,
    responseTime,
  };

  if (data) meta.data = data;
  if (error) meta.error = error;

  error ? logger.error(message, meta) : logger.info(message, meta);
};

export const successResponse = <T>(
  res: Response,
  req: Request,
  statusCode: number = 200,
  message: string,
  data: T
) => {
  logRequest({
    req,
    res,
    message: "Success Response",
    data,
  });

  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
