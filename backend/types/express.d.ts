import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      user?: {
        userId: Types.ObjectId;
        role: string;
      };
    }
  }
}

export {};
