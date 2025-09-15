import express from "express";
import {
  getDashboardInsights,
  getDashboardSummary,
} from "../controllers/dashboardController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

// Get dashboard summary
router.get("/summary", authenticateJWT, getDashboardSummary);
router.get("/insights", authenticateJWT, getDashboardInsights);

export default router;
