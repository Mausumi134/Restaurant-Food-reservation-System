import express from "express";
import {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuByCategory,
  toggleAvailability,
  getPopularItems
} from "../controller/menuController.js";
import { authenticateToken, authorizeRoles, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", optionalAuth, getMenuItems);
router.get("/popular", getPopularItems);
router.get("/by-category", getMenuByCategory);
router.get("/:id", getMenuItem);

export default router;