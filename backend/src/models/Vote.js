import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    predictionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prediction", required: true },
    selectedOption: { type: String, enum: ["yes", "no"], required: true },
    isCorrect: { type: Boolean, default: null },
    pointsEarned: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

voteSchema.index({ userId: 1, predictionId: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);
