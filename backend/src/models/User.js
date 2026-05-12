import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    points: { type: Number, default: 0, min: 0 },
    correctPredictions: { type: Number, default: 0, min: 0 },
    totalPredictions: { type: Number, default: 0, min: 0 },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

userSchema.virtual("accuracy").get(function getAccuracy() {
  if (!this.totalPredictions) return 0;
  return Math.round((this.correctPredictions / this.totalPredictions) * 100);
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("User", userSchema);
