import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export function publicUser(user) {
  const obj = user.toJSON();
  obj.accuracy = user.totalPredictions ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0;
  return obj;
}

export function validateMarketPayload(body) {
  const required = ["title", "description", "category", "deadline", "resolutionSource", "resolutionCriteria", "pointsValue"];
  const missing = required.filter((key) => body[key] === undefined || body[key] === "");
  if (missing.length) return `${missing.join(", ")} required`;
  if (Number.isNaN(Date.parse(body.deadline))) return "deadline must be a valid date";
  if (Number(body.pointsValue) < 1) return "pointsValue must be at least 1";
  if (body.status && !["open", "closed", "resolved"].includes(body.status)) return "invalid status";
  if (body.result && !["yes", "no"].includes(body.result)) return "invalid result";
  return null;
}
