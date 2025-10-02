import { Response } from "express";
import Budget from "../models/budget";
import Expense from "../models/expense";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { startOfDay, endOfDay } from "date-fns";

// logging expense
export const logExpensesBulk = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const expenses = req.body; // array of {categoryName, amount, note}
    const userId = req.user?.id;

    const budget = await Budget.findOne({ userId });

    // check for active budget
    if (!budget) {
      return res.status(404).json({ message: "No active budget found." });
    }
    // check if budget is still valid
    const now = new Date();
    const endDate = new Date(budget.startDate);

    endDate.setDate(endDate.getDate() + budget.duration);

    if (now > endDate) {
      return res.status(403).json({ message: "Budget has expired." });
    }

    // To set a the limit to daily expense entry to five
    // Count today's existing expenses
    const todayCount = await Expense.countDocuments({
      userId,
      date: {
        $gte: startOfDay(now),
        $lte: endOfDay(now),
      },
    });

    const remainingSlots = 5 - todayCount;

    if (expenses.length > remainingSlots) {
      return res.status(400).json({
        // message: `You can only log ${remainingSlots} more expense${remainingSlots === 1 ? "":"s"} today.`,
        message: `You've reached your daily limit. You can only log ${remainingSlots} more expense${
          remainingSlots === 1 ? "" : "s"
        } today.`,
      });
    }

    const savedExpenses = [];

    for (const entry of expenses) {
      const { categoryName, amount, note } = entry;

      const category = budget.categories.find(
        (cat) => cat.name === categoryName
      );

      if (!category) {
        return res
          .status(404)
          .json({ message: `Category ${categoryName} not found in budget.` });
      }

      const expense = new Expense({
        userId,
        categoryName,
        amount,
        note,
        date: now,
      });

      await expense.save();
      category.spent += amount;
      savedExpenses.push(expense);
    }

    await budget.save();

    res
      .status(200)
      .json({ message: "Expense logged successfully", data: savedExpenses });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Failed to log expenses", error: message });
  }
};

// create the endpoint to get the users document count for expense logged for the day
export const getTodayExpenseCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const now = new Date();
  const count = await Expense.countDocuments({
    userId,
    date: {
      $gte: startOfDay(now),
      $lte: endOfDay(now),
    },
  });
  res.status(200).json({ count });
};
