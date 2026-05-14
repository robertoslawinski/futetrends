import express from "express";
import { getFootballIntelligence } from "../services/footballIntelligence.js";

const router = express.Router();

router.get("/intelligence", async (_req, res, next) => {
  try {
    const payload = await getFootballIntelligence();
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

export default router;
