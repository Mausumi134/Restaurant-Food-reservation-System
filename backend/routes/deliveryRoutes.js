import express from "express";
import {
  createDeliveryTracking,
  getDeliveryTracking,
  updateDeliveryLocation,
  updateDeliveryStatus,
  getActiveDeliveries,
  calculateDeliveryTime
} from "../controller/deliveryController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.get("/track/:orderId", authenticateToken, getDeliveryTracking);
router.post("/calculate-time", calculateDeliveryTime);

export default router;