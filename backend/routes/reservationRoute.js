import express from "express";
import {
  sendReservation,
  getUserReservations,
  getReservation,
  updateReservationStatus,
  cancelReservation,
  getAllReservations
} from "../controller/reservation.js";
import { authenticateToken, authorizeRoles, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public/Customer routes
router.post("/send", optionalAuth, sendReservation);

// Protected customer routes
router.get("/my-reservations", authenticateToken, getUserReservations);
router.get("/:id", authenticateToken, getReservation);
router.patch("/:id/cancel", authenticateToken, cancelReservation);

export default router;