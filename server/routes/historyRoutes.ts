import express from "express";
import { getExpenseHistory } from "../controllers/historyControllers";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

// get grouped expense history
router.get("/", authenticateJWT, getExpenseHistory);

export default router;