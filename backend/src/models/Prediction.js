import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 8, maxlength: 180 },
    description: { type: String, required: true, trim: true, minlength: 20, maxlength: 1200 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    options: { type: [String], default: ["yes", "no"], enum: ["yes", "no"] },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed", "resolved"], default: "open" },
    result: { type: String, enum: ["yes", "no", null], default: null },
    resolutionSource: { type: String, required: true, trim: true, maxlength: 250 },
    resolutionCriteria: { type: String, required: true, trim: true, minlength: 20, maxlength: 1200 },
    pointsValue: { type: Number, required: true, min: 1, max: 1000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

predictionSchema.index({ status: 1, category: 1, deadline: 1 });

export default mongoose.model("Prediction", predictionSchema);
