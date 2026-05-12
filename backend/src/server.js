import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`FuteTrends API listening on ${port}`));
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
