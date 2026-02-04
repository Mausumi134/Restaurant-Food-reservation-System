import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
} from "../controller/orderController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getUserOrders);
router.get("/:id", authenticateToken, getOrder);
router.patch("/:id/cancel", authenticateToken, cancelOrder);

export default router;