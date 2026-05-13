import bcrypt from "bcryptjs";
import Prediction from "../models/Prediction.js";
import User from "../models/User.js";
import { seedMarkets } from "../data/seedMarkets.js";

export async function seedIfEmpty() {
  const count = await Prediction.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped: ${count} markets already exist`);
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@futetrends.com";
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.log("Seed skipped: ADMIN_PASSWORD is required when SEED_ON_START=true");
    return;
  }

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || "FuteTrends Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "admin"
    });
  }

  await Prediction.insertMany(seedMarkets.map((market) => ({
    ...market,
    createdBy: admin._id,
    options: ["yes", "no"]
  })));

  console.log(`Seeded ${seedMarkets.length} markets because database was empty`);
}
