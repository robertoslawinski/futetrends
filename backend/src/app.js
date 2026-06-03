import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import predictionRoutes from "./routes/predictions.js";
import rankingRoutes from "./routes/ranking.js";
import userRoutes from "./routes/users.js";
import footballRoutes from "./routes/football.js";
import { seedIfEmpty } from "./scripts/seedIfEmpty.js";
import { upsertSeedMarkets } from "./scripts/upsertSeedMarkets.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
function normalizeOrigin(origin) {
  return origin?.replace(/\/$/, "");
}

const allowedOrigins = new Set([
  normalizeOrigin(process.env.CLIENT_ORIGIN) || "http://localhost:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://futetrends.netlify.app",
  "https://futetrends.com",
  "https://www.futetrends.com",
  "http://futetrends.com",
  "http://www.futetrends.com"
]);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/health", (_req, res) => res.json({ ok: true, name: "FuteTrends API" }));
app.post("/admin/seed", async (req, res, next) => {
  try {
    if (!process.env.SEED_TOKEN || req.headers["x-seed-token"] !== process.env.SEED_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const result = await seedIfEmpty();
    res.json({ message: "Seed checked", result });
  } catch (err) {
    next(err);
  }
});
app.post("/admin/upsert-markets", async (req, res, next) => {
  try {
    if (!process.env.SEED_TOKEN || req.headers["x-seed-token"] !== process.env.SEED_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const replace = req.query.replace === "true" || req.body?.replace === true;
    const result = await upsertSeedMarkets({ replace });
    res.json({ message: "Markets upsert checked", result });
  } catch (err) {
    next(err);
  }
});
app.use("/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/football", footballRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
