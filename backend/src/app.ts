import express from "express";
import { logRequest } from "utils/index.utils.js";
import compressionMiddleware from "middleware/compression.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compressionMiddleware);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Lekhan API!");
  logRequest({
    req,
    res,
    message: " Root endpoint accessed ",
    data: {
      name: "Prithivi",
    },
  });
});

export default app;
