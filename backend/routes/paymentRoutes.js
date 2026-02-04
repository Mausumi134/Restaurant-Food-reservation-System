import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getPayment,
  getPaymentHistory,
  processRefund
} from "../controller/paymentController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/create-intent", authenticateToken, createPaymentIntent);
router.post("/confirm", authenticateToken, confirmPayment);
router.get("/history", authenticateToken, getPaymentHistory);
router.get("/:id", authenticateToken, getPayment);

export default router;