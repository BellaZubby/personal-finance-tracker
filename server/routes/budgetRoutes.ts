import express from "express";
import {
  createBudget,
  deleteBudget,
  getCurrentBudget,
} from "../controllers/budgetController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

// create budget
router.post("/create", authenticateJWT, createBudget);

// reset budget
router.delete("/reset", authenticateJWT, deleteBudget);

// get current budget
router.get("/current", authenticateJWT, getCurrentBudget);

export default router;
