import type { Request, Response, NextFunction } from "express";
import logger from "lib/logger.lib.js";
import { APIError, keyFn } from "utils/index.utils.js";
import {
  RateLimiterMemory,
  IRateLimiterOptions,
  RateLimiterRes,
} from "rate-limiter-flexible";

const globalOptions: IRateLimiterOptions = {
  points: 100, // Number of points
  duration: 60, // Per second(s)
  blockDuration: 300, // Block for 5 minutes if consumed more than points
};

const apiOptions: IRateLimiterOptions = {
  points: 50, // Number of points
  duration: 60, // Per second(s)
  blockDuration: 300, // Block for 5 minutes if consumed more than points
};

const authOptions: IRateLimiterOptions = {
  points: 20, // Number of points
  duration: 60, // Per second(s)
  blockDuration: 300, // Block for 5 minutes if consumed more than points
};

const editorOptions: IRateLimiterOptions = {
  points: 30, // Number of points
  duration: 60, // Per second(s)
  blockDuration: 300, // Block for 5 minutes if consumed more than points
};

const userOptions: IRateLimiterOptions = {
  points: 40, // Number of points
  duration: 60, // Per second(s)
  blockDuration: 300, // Block for 5 minutes if consumed more than points
};

export const limiters = {
  global: new RateLimiterMemory(globalOptions),
  api: new RateLimiterMemory(apiOptions),
  auth: new RateLimiterMemory(authOptions),
  editor: new RateLimiterMemory(editorOptions),
  user: new RateLimiterMemory(userOptions),
};

const rateLimiter =
  (limiter: RateLimiterMemory, keyFn: (req: Request) => string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rateRes: RateLimiterRes = await limiter.consume(keyFn(req));

      res.setHeader("X-RateLimit-Limit", limiter.points.toString());
      res.setHeader(
        "X-RateLimit-Remaining",
        rateRes.remainingPoints.toString()
      );
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(Date.now() + rateRes.msBeforeNext).toISOString()
      );

      next();
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        res.setHeader(
          "Retry-After",
          Math.ceil(error.msBeforeNext / 1000).toString()
        );
        res.setHeader("X-RateLimit-Limit", limiter.points.toString());
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader(
          "X-RateLimit-Reset",
          new Date(Date.now() + error.msBeforeNext).toISOString()
        );

        logger.warn(
          `Rate limit exceeded: key=${keyFn(req)}, limit=${
            limiter.points
          }, resetIn=${error.msBeforeNext}ms`
        );
        return next(
          new APIError(429, "Too Many Requests - Please try again later")
        );
      }
      logger.error("Rate Limit Error", error);
      next(error);
    }
  };
