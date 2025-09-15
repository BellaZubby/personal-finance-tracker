import { Response } from "express";
import Expense from "../models/expense";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// Group expenses by date for the logged-in user
export const getExpenseHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    // fetch all expenses for the user and sorts by date in ascending order (from the oldest to newest)
    const expenses = await Expense.find({ userId }).sort({ date: 1 });

    // group expenses by date
    const grouped: Record<string, any[]> = {};

    expenses.forEach((exp) => {
      const dateKey = exp.date.toISOString().split("T")[0];

      if (dateKey) {
        if (!grouped[dateKey]) grouped[dateKey] = [];

        grouped[dateKey].push({
          categoryName: exp.categoryName,
          amount: exp.amount,
          note: exp.note,
        });
      }
    });
    res
      .status(200)
      .json({
        message: "Expense log history fetched successfully",
        data: grouped,
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch history.", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to fetch history.", error: String(error) });
    }
  }
};
