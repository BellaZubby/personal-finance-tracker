import express from "express";
import { createBudget, deleteBudget } from "../controllers/budgetController";
import { authenticateJWT } from "../middleware/authMiddleware";


const router = express.Router();

// create budget
router.post("/create", authenticateJWT, createBudget);

// reset budget
router.delete("/reset", authenticateJWT, deleteBudget);


export default router