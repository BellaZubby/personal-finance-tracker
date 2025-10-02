import express from "express";
import {
  getTodayExpenseCount,
  logExpensesBulk,
} from "../controllers/expenseController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

// create budget
router.post("/bulk", authenticateJWT, logExpensesBulk);
router.get("/today/count", authenticateJWT, getTodayExpenseCount);

export default router;
