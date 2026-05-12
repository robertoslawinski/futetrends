import express from "express";
import Vote from "../models/Vote.js";
import { requireAuth } from "../middleware/auth.js";
import { publicUser } from "../utils.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const votes = await Vote.find({ userId: req.user._id })
      .populate("predictionId", "title category status result pointsValue deadline")
      .sort({ createdAt: -1 });

    res.json({
      user: publicUser(req.user),
      history: votes.map((vote) => ({
        id: vote._id,
        prediction: vote.predictionId,
        selectedOption: vote.selectedOption,
        isCorrect: vote.isCorrect,
        pointsEarned: vote.pointsEarned,
        createdAt: vote.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
});

export default router;
