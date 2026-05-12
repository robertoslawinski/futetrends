import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Prediction from "../models/Prediction.js";
import User from "../models/User.js";
import Vote from "../models/Vote.js";
import { seedMarkets } from "../data/seedMarkets.js";

dotenv.config();

await connectDB();

const adminEmail = process.env.ADMIN_EMAIL || "admin@futetrends.com";
const adminPassword = process.env.ADMIN_PASSWORD || "change-this-password";
let admin = await User.findOne({ email: adminEmail });

if (!admin) {
  admin = await User.create({
    name: process.env.ADMIN_NAME || "FuteTrends Admin",
    email: adminEmail,
    passwordHash: await bcrypt.hash(adminPassword, 12),
    role: "admin"
  });
}

await Vote.deleteMany({});
await Prediction.deleteMany({});
await Prediction.insertMany(seedMarkets.map((market) => ({ ...market, createdBy: admin._id, options: ["yes", "no"] })));

console.log(`Seeded ${seedMarkets.length} markets. Admin email: ${adminEmail}`);
process.exit(0);
