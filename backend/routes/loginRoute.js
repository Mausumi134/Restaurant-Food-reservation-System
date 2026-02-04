import express from "express";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import ErrorHandler from "../error/error.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if account is active
    if (!user.isActive) {
      return next(new ErrorHandler("Account is deactivated. Please contact support.", 401));
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});

export default router;
