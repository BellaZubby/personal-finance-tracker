import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Budget from "../models/budget";
import Expense from "../models/expense";

// create a new budget for the authenticated user
export const createBudget = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { duration, categories } = req.body;
    const userId = req.user?.id; // from auth middleware

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // checks if a budget already exists
    const existingBudget = await Budget.findOne({ userId });

    if (existingBudget) {
      return res
        .status(409)
        .json({ message: "Budget already exists for this user." });
    }

    const budget = new Budget({
      userId,
      duration,
      startDate: new Date(),
      categories,
      isSaved: true,
    });

    await budget.save();
    res
      .status(201)
      .json({ message: "budget created successfully", data: budget });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to create budget", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to create budget", error: String(error) });
    }
  }
};

// Delete the user's budget (used for reset)
export const deleteBudget = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    // delete the user's budget
    const deletedBudget = await Budget.deleteOne({ userId });

    // To delete expenses tied to the reset budget

    if (deletedBudget) {
      await Expense.deleteMany({userId});
    }

    // delete all expenses associated with the user
    res.status(200).json({ message: "Budget reset successful," });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to reset budget", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to reset budget", error: String(error) });
    }
  }
};

// Getting existing budget
export const getCurrentBudget = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(200).json({ exists: false });
    }

    const start = new Date(budget.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + budget.duration);

    const today = new Date();
    const isExpired = today > end;

    res.status(200).json({
      exists: true,
      isExpired,
      data: budget,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Failed to fetch budget", error: message });
  }
};
