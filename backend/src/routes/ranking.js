import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).sort({ points: -1, correctPredictions: -1, totalPredictions: 1 }).limit(100);
    res.json({
      ranking: users.map((user, index) => ({
        rank: index + 1,
        id: user._id,
        name: user.name,
        points: user.points,
        correctPredictions: user.correctPredictions,
        totalPredictions: user.totalPredictions,
        accuracy: user.totalPredictions ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0
      }))
    });
  } catch (err) {
    next(err);
  }
});

export default router;
