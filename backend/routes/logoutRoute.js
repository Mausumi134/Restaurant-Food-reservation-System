import express from "express";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, async (req, res, next) => {
  try {
    // In a production app, you might want to:
    // 1. Add the token to a blacklist
    // 2. Store blacklisted tokens in Redis with expiration
    // 3. Update user's last logout time
    
    // For now, we'll just send a success response
    // The frontend will handle clearing the token
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    next(error);
  }
});

export default router;