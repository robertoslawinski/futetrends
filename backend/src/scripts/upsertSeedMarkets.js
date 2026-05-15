import bcrypt from "bcryptjs";
import Prediction from "../models/Prediction.js";
import User from "../models/User.js";
import Vote from "../models/Vote.js";
import { seedMarkets } from "../data/seedMarkets.js";

async function getAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@futetrends.com";
  let admin = await User.findOne({ email: adminEmail, role: "admin" });
  if (admin) return admin;

  admin = await User.findOne({ role: "admin" });
  if (admin) return admin;

  if (!process.env.ADMIN_PASSWORD) return null;

  return User.create({
    name: process.env.ADMIN_NAME || "FuteTrends Admin",
    email: adminEmail,
    passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
    role: "admin"
  });
}

export async function upsertSeedMarkets() {
  const admin = await getAdminUser();
  if (!admin) {
    return { upserted: false, reason: "missing_admin_user_or_admin_password" };
  }

  const result = { created: 0, updated: 0, skipped: 0 };

  for (const market of seedMarkets) {
    const existing = await Prediction.findOne({ title: market.title });

    if (!existing) {
      await Prediction.create({
        ...market,
        createdBy: admin._id,
        options: ["yes", "no"]
      });
      result.created += 1;
      continue;
    }

    const voteCount = await Vote.countDocuments({ predictionId: existing._id });
    if (existing.status === "resolved" || voteCount > 0) {
      result.skipped += 1;
      continue;
    }

    Object.assign(existing, {
      ...market,
      createdBy: existing.createdBy || admin._id,
      options: ["yes", "no"]
    });
    await existing.save();
    result.updated += 1;
  }

  return { upserted: true, ...result };
}
