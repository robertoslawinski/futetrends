import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedIfEmpty } from "./scripts/seedIfEmpty.js";

dotenv.config();

const port = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

connectDB()
  .then(async () => {
    if (process.env.SEED_ON_START === "true") {
      await seedIfEmpty();
    }
    app.listen(port, () => console.log(`FuteTrends API listening on ${port}`));
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
