import express from "express";

export const indexRoute = express.Router();

indexRoute.get("/", (_req, res) => {
  res.send({ uptime: process.uptime() });
});
