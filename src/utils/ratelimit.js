import rateLimit from "express-rate-limit";
import { AppError } from "./appError.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
 
  handler: (req, res) => {
    const retryAfterMinutes = Math.ceil(
      (req.rateLimit.resetTime - Date.now()) / (1000 * 60)
    );
    throw new AppError(
      `Too many requests, please try again after ${retryAfterMinutes} minutes`,
      429
    );
  },
});

export default authLimiter;
