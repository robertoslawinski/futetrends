import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { upsertSeedMarkets } from "./upsertSeedMarkets.js";

dotenv.config();

try {
  await connectDB();
  const result = await upsertSeedMarkets({ replace: process.env.REPLACE_SEED_MARKETS === "true" });
  console.log("Market upsert complete:", result);
} catch (err) {
  console.error("Market upsert failed", err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
