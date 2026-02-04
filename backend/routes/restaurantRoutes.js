import express from "express";
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMyRestaurants
} from "../controller/restaurantController.js";
import { authenticateToken, authorizeRoles, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", optionalAuth, getRestaurants);
router.get("/:id", getRestaurant);

// Protected routes
router.post("/", authenticateToken, authorizeRoles("restaurant_owner", "admin"), createRestaurant);
router.get("/owner/my-restaurants", authenticateToken, authorizeRoles("restaurant_owner", "admin"), getMyRestaurants);
router.put("/:id", authenticateToken, authorizeRoles("restaurant_owner", "admin"), updateRestaurant);
router.delete("/:id", authenticateToken, authorizeRoles("restaurant_owner", "admin"), deleteRestaurant);

export default router;