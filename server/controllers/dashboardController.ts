import { Response } from "express";
import Budget from "../models/budget";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Expense from "../models/expense";

// Get dashboard summary for the logged-in user
export const getDashboardSummary = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // extract the userId from cookies which is a reference key
    const userId = req.user?.id;

    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.status(404).json({ message: "No budget found." });
    }

    // extract my categories
    const categories = budget.categories.map((cat) => {
      const remaining = cat.amount - cat.spent;
      const percentageSpent =
        cat.amount > 0 ? Math.round((cat.spent / cat.amount) * 100) : 0;

      return {
        name: cat.name,
        amount: cat.amount,
        spent: cat.spent,
        remaining,
        percentageSpent,
      };
    });

    // calculate end date and status
    const now = new Date();
    const endDate = new Date(budget.startDate);
    endDate.setDate(endDate.getDate() + budget.duration);

    const status = now > endDate ? "Expired" : "Active";

    // Calculate totals
    const totalAllocated = budget.categories.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );
    const totalSpent = budget.categories.reduce(
      (sum, cat) => sum + cat.spent,
      0
    );
    const remaining = totalAllocated - totalSpent;

    // fetch all expense for the user to obtain DAILY SPEND TREND
    const expenses = await Expense.find({ userId }).sort({ date: 1 });

    // Group total spent per day
    const dailySpendTrend: Record<string, number> = {};

    expenses.forEach((exp) => {
      const dateKey = exp.date?.toISOString().split("T")[0];

      if (dateKey) {
        if (!dailySpendTrend[dateKey]) {
          dailySpendTrend[dateKey] = 0;
        }
        dailySpendTrend[dateKey] += exp.amount;
      }
    });

    res.status(200).json({
      message: "Dashboard summary retrieved successfully",
      data: {
        startDate: budget.startDate,
        endDate,
        duration: budget.duration,
        status,
        totalAllocated,
        totalSpent,
        remaining,
        categories,
        dailySpendTrend,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch dashboard.", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to fetch dashboard.", error: String(error) });
    }
  }
};

// Insights and Feedback

// Generate AI-like feedback based on budget and expenses
export const getDashboardInsights = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    // fetch budget and expenses
    const budget = await Budget.findOne({ userId });
    const expenses = await Expense.find({ userId }).sort({ date: 1 });

    if (!budget) {
      return res.status(404).json({ message: "No budget found." });
    }

    // Calculate totals
    const totalAllocated = budget.categories.reduce(
      (sum, cat) => sum + cat.amount,
      0
    );
    const totalSpent = budget.categories.reduce(
      (sum, cat) => sum + cat.spent,
      0
    );
    const remaining = totalAllocated - totalSpent;

    // Health score (basic formula)
    const overspentCategories = budget.categories.filter(
      (cat) => cat.spent > cat.amount
    );
    const healthScore = Math.max(0, 100 - overspentCategories.length * 10);

    // Feedback array
    const suggestions: string[] = [];
    const behaviorFlags: string[] = [];
    const timeBasedFeedback: string[] = [];

    // Time progress calculation
    const startDate = new Date(budget.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const elapsedDays = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const duration = budget.duration;
    const timeProgress = Math.min(1, elapsedDays / duration); // clamp to 1

    // checks for budget final day
    const isFinalDay = elapsedDays === duration - 1;

    // category pacing feedback
    budget.categories.forEach((cat) => {
      const spentRatio = cat.spent / cat.amount;

      if (timeProgress >= 0.25 && timeProgress < 0.5) {
        if (spentRatio <= 0.25) {
          timeBasedFeedback.push(
            `You are 1/4 into your budget cycle and your ${cat.name} spending looks great. Keep it up!`
          );
        }
      }

      if (timeProgress >= 0.5 && timeProgress < 0.75) {
        if (spentRatio <= 0.5) {
          timeBasedFeedback.push(
            `Halfway through and your ${cat.name} spending is on track.`
          );
        } else {
          timeBasedFeedback.push(
            `You are halfway through but ${cat.name} spending is ahead of pace. Consider slowing down.`
          );
        }
      }

      if (cat.spent > cat.amount) {
        behaviorFlags.push(`${cat.name} category is overspent.`);

        const name = cat.name.toLowerCase();

        if (name.includes("food")) {
          suggestions.push(
            "You have overspent on food — try cutting down on outdoor dining or meal prepping."
          );
        }
        if (name.includes("transport")) {
          suggestions.push(
            "Transportation costs are high — consider carpooling or using public transit."
          );
        }
        if (name.includes("rent")) {
          suggestions.push(
            "Rent exceeded budget — explore negotiating rent or finding more affordable housing."
          );
        }
        if (name.includes("medical")) {
          suggestions.push(
            "Medical expenses were high — consider setting aside an emergency health fund."
          );
        }
        if (name.includes("airtime") || name.includes("data")) {
          suggestions.push(
            "Airtime/Data usage is high — try monitoring app usage or switching to a better plan."
          );
        }
        if (name.includes("wardrobe")) {
          suggestions.push(
            "Wardrobe spending is high — consider seasonal budgeting or thrifting options."
          );
        }
        if (name.includes("entertainment")) {
          suggestions.push(
            "Entertainment costs are up — explore free or low-cost activities next cycle."
          );
        }
        if (name.includes("other")) {
          suggestions.push(
            "Miscellaneous spending is high — review what is included and trim non-essentials."
          );
        }
      }

      // gives suggestion if we have a remaining amount from budget
      if (isFinalDay) {
        const remainingAmount = cat.amount - cat.spent;

        if (remainingAmount > 0) {
          suggestions.push(
            `You still have ₦${remainingAmount.toLocaleString()} left in your ${
              cat.name
            } budget. Consider saving this amount or rolling it over to next cycle. Weldone 👏`
          );
        }
      }
    });

    // daily spend gaps
    const dateSet = new Set<string>();
    expenses.forEach((exp) => {
      const dateKey = exp.date?.toISOString().split("T")[0];
      if (dateKey) dateSet.add(dateKey);
    });

    // loop through each day in the budget duration
    for (let i = 0; i < budget.duration; i++) {
      // create a fresh date for each iteration
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      day.setHours(0, 0, 0, 0);

      // only checks if day is within budget duration AND strictly before today

      if (day >= startDate && day < today) {
        const key = day.toISOString().split("T")[0];
        if (key) {
          if (!dateSet.has(key)) {
            behaviorFlags.push(`No spending logged on ${key}.`);
          }
        } else if (day.getTime() === today.getTime()) {
          // checks today and gives a subtle reminder that no logs yet
          // today → softer note
          if (key) {
            if (!dateSet.has(key)) {
              behaviorFlags.push(`No spending logged yet for today (${key}).`);
            }
          }
        }
      }
    }

    // return insights
    res.status(200).json({
      healthScore,
      suggestions,
      behaviorFlags,
      timeBasedFeedback,
      totalAllocated,
      totalSpent,
      remaining,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Failed to generate insights.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Failed to generate insights.",
        error: String(error),
      });
    }
  }
};
