import {Response} from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Budget from "../models/budget";

// create a new budget for the authenticated user
export const createBudget = async(req: AuthenticatedRequest, res: Response) => {
    try {

        const {duration, categories} = req.body;
        const userId = req.user?.id; // from auth middleware

        const budget = new Budget({
            userId,
            duration,
            startDate: new Date(),
            categories,
            isSaved: true
        });

        await budget.save();
        res.status(201).json({message: "budget created successfully", data: budget});

    } catch (error) {
         if (error instanceof Error) {
    res.status(500).json({ message: "Failed to create budget", error: error.message });
  } else {
    res.status(500).json({ message: "Failed to create budget", error: String(error) });
  }
    }
};


// Delete the user's budget (used for reset)
export const deleteBudget = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        await Budget.deleteOne({userId});
        res.status(200).json({message: "Budget reset successful,"})
    } catch (error) {
         if (error instanceof Error) {
    res.status(500).json({ message: "Failed to reset budget", error: error.message });
  } else {
    res.status(500).json({ message: "Failed to reset budget", error: String(error) });
  }
    }
}