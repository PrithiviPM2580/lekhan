import type { Request, Response } from "express";

declare global {
  type ErrorDetail = {
    field?: string;
    message?: string;
  };
  type APIErrorType = string | { type: string; details?: ErrorDetail[] };

  interface LogOptions {
    req: Request;
    res?: Response;
    message: string;
    data?: unknown;
    error?: unknown;
  }
}

export {};
