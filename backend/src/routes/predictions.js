import express from "express";
import mongoose from "mongoose";
import Prediction from "../models/Prediction.js";
import Vote from "../models/Vote.js";
import User from "../models/User.js";
import { optionalAuth, requireAdmin, requireAuth } from "../middleware/auth.js";
import { validateMarketPayload } from "../utils.js";

const router = express.Router();

async function attachStats(prediction, userId) {
  const votes = await Vote.find({ predictionId: prediction._id });
  const yes = votes.filter((vote) => vote.selectedOption === "yes").length;
  const no = votes.filter((vote) => vote.selectedOption === "no").length;
  const totalVotes = votes.length;
  const userVote = userId ? votes.find((vote) => vote.userId.equals(userId)) : null;
  return {
    ...prediction.toJSON(),
    totalVotes,
    voteBreakdown: {
      yes,
      no,
      yesPercent: totalVotes ? Math.round((yes / totalVotes) * 100) : 0,
      noPercent: totalVotes ? Math.round((no / totalVotes) * 100) : 0
    },
    userVote: userVote?.selectedOption || null
  };
}

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const filter = {};
    if (["open", "closed", "resolved"].includes(req.query.status)) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const predictions = await Prediction.find(filter).sort({ status: 1, deadline: 1 });
    const enriched = await Promise.all(predictions.map((prediction) => attachStats(prediction, req.user?._id)));
    const categories = await Prediction.distinct("category");
    res.json({ predictions: enriched, categories });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({ message: "Market not found" });
    const prediction = await Prediction.findById(req.params.id).populate("createdBy", "name");
    if (!prediction) return res.status(404).json({ message: "Market not found" });
    res.json({ prediction: await attachStats(prediction, req.user?._id) });
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const error = validateMarketPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const prediction = await Prediction.create({
      ...req.body,
      pointsValue: Number(req.body.pointsValue),
      createdBy: req.user._id,
      options: ["yes", "no"]
    });
    res.status(201).json({ prediction });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const error = validateMarketPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Market not found" });
    if (prediction.status === "resolved") return res.status(400).json({ message: "Resolved markets cannot be edited" });

    Object.assign(prediction, {
      ...req.body,
      pointsValue: Number(req.body.pointsValue),
      result: req.body.result || null,
      options: ["yes", "no"]
    });
    await prediction.save();
    res.json({ prediction });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Market not found" });
    await Vote.deleteMany({ predictionId: prediction._id });
    await prediction.deleteOne();
    res.json({ message: "Market deleted" });
  } catch (err) {
    next(err);
  }
});

router.put("/:id/resolve", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { result } = req.body;
    if (!["yes", "no"].includes(result)) return res.status(400).json({ message: "Result must be yes or no" });

    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Market not found" });
    if (prediction.status === "resolved") return res.status(400).json({ message: "Market already resolved" });

    const votes = await Vote.find({ predictionId: prediction._id });
    for (const vote of votes) {
      vote.isCorrect = vote.selectedOption === result;
      vote.pointsEarned = vote.isCorrect ? prediction.pointsValue : 0;
      await vote.save();
      await User.findByIdAndUpdate(vote.userId, {
        $inc: {
          totalPredictions: 1,
          correctPredictions: vote.isCorrect ? 1 : 0,
          points: vote.pointsEarned
        }
      });
    }

    prediction.status = "resolved";
    prediction.result = result;
    await prediction.save();
    res.json({ prediction, resolvedVotes: votes.length });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/vote", requireAuth, async (req, res, next) => {
  try {
    const { selectedOption } = req.body;
    if (!["yes", "no"].includes(selectedOption)) return res.status(400).json({ message: "Choose yes or no" });

    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Market not found" });
    if (prediction.status !== "open") return res.status(400).json({ message: "This market is not open" });
    if (new Date(prediction.deadline) <= new Date()) return res.status(400).json({ message: "The deadline has passed" });

    try {
      await Vote.create({ userId: req.user._id, predictionId: prediction._id, selectedOption });
    } catch (err) {
      if (err.code === 11000) return res.status(409).json({ message: "You already predicted this market" });
      throw err;
    }

    res.status(201).json({ prediction: await attachStats(prediction, req.user._id) });
  } catch (err) {
    next(err);
  }
});

export default router;
