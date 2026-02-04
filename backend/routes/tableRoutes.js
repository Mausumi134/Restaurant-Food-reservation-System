import express from "express";
import {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
  getTableAvailability
} from "../controller/tableController.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getTables);
router.get("/availability/:date", getTableAvailability);
router.get("/:id", getTable);

export default router;