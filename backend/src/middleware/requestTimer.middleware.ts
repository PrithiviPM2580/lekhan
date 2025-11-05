import type { Request, Response, NextFunction } from "express";

const requestTimer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.startTime = Date.now();
  next();
};

export default requestTimer;
