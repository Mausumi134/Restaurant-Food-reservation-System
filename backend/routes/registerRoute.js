import express from "express";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import ErrorHandler from "../error/error.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  const { firstName, lastName, email, username, password, passwordConf, phone } = req.body;

  try {
    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password || !passwordConf) {
      return next(new ErrorHandler("Please fill out all required fields", 400));
    }

    // Check if password matches confirmation
    if (password !== passwordConf) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    // Check password strength
    if (password.length < 6) {
      return next(new ErrorHandler("Password must be at least 6 characters long", 400));
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new ErrorHandler("Email is already registered", 400));
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(new ErrorHandler("Username is already taken", 400));
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password,
      phone
    });

    // Save user (password will be hashed automatically)
    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id);

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Registration successful! You are now logged in.",
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});

export default router;
