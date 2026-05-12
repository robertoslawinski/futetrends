import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
}

const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
const admin = await User.findOneAndUpdate(
  { email: ADMIN_EMAIL.toLowerCase().trim() },
  { name: ADMIN_NAME || "FuteTrends Admin", email: ADMIN_EMAIL, passwordHash, role: "admin" },
  { new: true, upsert: true }
);

console.log(`Admin ready: ${admin.email}`);
process.exit(0);
