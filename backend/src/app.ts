import express from "express";
import { logRequest } from "utils/index.utils.js";
import compressionMiddleware from "middleware/compression.middleware.js";
import rateLimiter, { limiters } from "middleware/rateLimiter.middleware.js";
import globalErrorHandler from "middleware/globalErrorHandler.middleware.js";
import requestTimer from "middleware/requestTimer.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compressionMiddleware);
app.use(requestTimer);

app.get(
  "/",
  rateLimiter(limiters.global, (req) => req.ip as string),
  (req, res) => {
    res.status(200).send("Welcome to Lekhan API!");
    logRequest({
      req,
      res,
      message: " Root endpoint accessed ",
      data: {
        name: "Prithivi",
      },
    });
  }
);

app.use(globalErrorHandler);

export default app;
