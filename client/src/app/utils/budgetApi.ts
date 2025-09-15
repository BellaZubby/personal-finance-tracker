import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseQueryWithRefresh";

export type BudgetCategory = {
  name: string;
  amount: number;
};

export type BudgetData = {
  duration: number;
  categories: BudgetCategory[];
  startDate: string;
};

export type GetCurrentBudgetResponse = {
  exists: boolean;
  isExpired: boolean;
  data?: BudgetData;
};

export interface BaseExpense {
  categoryName: string;
  amount: number;
  note?: string;
}

export interface SavedExpense extends BaseExpense {
  id: string;
  date: string;
}

export type CategorySummary = {
  name: string; // e.g. "Food", "Transport"
  amount: number; // Total allocated for this category
  spent: number; // Total spent so far
  remaining: number; // amount - spent
  percentageSpent: number; // (spent / amount) * 100, rounded
};

// expense log history
export type ExpenseEntry = {
  categoryName: string;
  amount: number;
  note?: string;
};

export type ExpenseHistoryResponse = {
  message: string;
  data: Record<string, ExpenseEntry[]>;
};

// type for insights
export type DashboardInsightsResponse = {
  healthScore: number;
  suggestions: string[];
  behaviorFlags: string[];
  timeBasedFeedback: string[];
  totalAllocated: number;
  totalSpent: number;
  remaining: number;
};

export const budgetApi = createApi({
  reducerPath: "budgetApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    // save budget
    createBudget: builder.mutation({
      query: (budgetData) => ({
        url: "/budget/create",
        method: "POST",
        body: budgetData,
      }),
    }),

    // Reset budget
    deleteBudget: builder.mutation<void, void>({
      query: () => ({
        url: "/budget/reset",
        method: "DELETE",
      }),
    }),

    // get current budget
    getCurrentBudget: builder.query<GetCurrentBudgetResponse, void>({
      query: () => ({
        url: "/budget/current",
        method: "GET",
      }),
    }),

    // expense log
    logExpensesBulk: builder.mutation<
      { message: string; data: SavedExpense[] },
      BaseExpense[]
    >({
      query: (expenses) => ({
        url: "/expense/bulk",
        method: "POST",
        body: expenses,
      }),
    }),

    getTodayExpenseCount: builder.query<{ count: number }, void>({
      query: () => ({
        url: "/expense/today/count",
        method: "Get",
      }),
    }),

    getDashboardSummary: builder.query<
      {
        message: string;
        data: {
          status: String;
          totalAllocated: number;
          totalSpent: number;
          remaining: number;
          categories: CategorySummary[];
          dailySpendTrend: Record<string, number>;
          startDate: Date;
          duration: number;
        };
      },
      void
    >({
      query: () => ({
        url: "/dashboard/summary",
        method: "GET",
      }),
    }),

    // for expense histroy
    getExpenseHistory: builder.query<ExpenseHistoryResponse, void>({
      query: () => ({
        url: "/history",
        method: "GET",
      }),
    }),

    // for AI-feedbacks
    getDashboardInsights: builder.query<DashboardInsightsResponse, void>({
      query: () => ({
        url: "/dashboard/insights",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateBudgetMutation,
  useDeleteBudgetMutation,
  useGetCurrentBudgetQuery,
  useLogExpensesBulkMutation,
  useGetTodayExpenseCountQuery,
  useGetDashboardSummaryQuery,
  useGetExpenseHistoryQuery,
  useGetDashboardInsightsQuery,
} = budgetApi;
