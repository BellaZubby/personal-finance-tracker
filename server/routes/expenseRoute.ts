import express from "express";
import { logExpense } from "../controllers/expenseController";
import { authenticateJWT } from "../middleware/authMiddleware";


const router = express.Router();

// create budget
router.post("/log", authenticateJWT, logExpense);



export default router