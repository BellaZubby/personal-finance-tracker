import {Response} from "express";
import Budget from "../models/budget"
import Expense from "../models/expense";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// logs an expense for a specific category
export const logExpense = async (req:AuthenticatedRequest, res: Response) => {
    try {
        const {categoryName, amount, note} = req.body;
        const userId = req.user?.id;

        const budget = await Budget.findOne({userId});

        if (!budget) {
            return res.status(404).json({message: "No active budget found."});
        }

        const now = new Date();
        const endDate = new Date(budget.startDate);
        endDate.setDate(endDate.getDate() + budget.duration); // calcaulates end date of budget based on start date and duration

        if (now > endDate) {
            return res.status(403).json({message: "Budget has expired."});
        }

        const category = budget.categories.find((cat) => cat.name === categoryName);

        if (!category) {
            return res.status(404).json({message: "Category not found"});
        }

        // log the expense as a separate document
        const expense = new Expense({
            userId,
            categoryName,
            amount,
            note,
            date: now,
        });

        await expense.save();

        // update the spent amount in the budget
        category.spent += amount;

        await budget.save();

        res.status(200).json({message: "Expense logged", data: expense});

    } catch (error) {
        if (error instanceof Error) {
    res.status(500).json({ message: "Failed to log expense", error: error.message });
  } else {
    res.status(500).json({ message: "Failed to log expense", error: String(error) });
  }
    }
};