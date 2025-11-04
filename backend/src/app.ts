import express from "express";

const app = express();
const x = 10;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
