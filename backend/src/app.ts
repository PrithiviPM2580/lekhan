import express from "express";
import { logRequest } from "utils/index.utils.js";

const app = express();

app.set("trust proxy", true);

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
