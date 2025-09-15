"use client";
import React, { useState, useEffect } from "react";
import {
  useGetCurrentBudgetQuery,
  useGetTodayExpenseCountQuery,
  useLogExpensesBulkMutation,
} from "@/app/utils/budgetApi";
import { BaseExpense } from "@/app/utils/budgetApi";
import { Spinner } from "@/app/components/Spinner";
import Link from "next/link";
import SaveExpenseModal from "@/app/components/SaveExpenseModal";
import { useRouter } from "next/navigation";
import { APIError } from "@/app/shared/types";

const ExpenseSetup = () => {
  // Local form state
  const [form, setForm] = useState({ categoryName: "", amount: "", note: "" });
  const [unsavedExpenses, setUnsavedExpenses] = useState<BaseExpense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [expenseCount, setExpenseCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  // for programmatic navigation
  const router = useRouter();

  // RTK Query hooks
  const { data: budgetData, isLoading: loadingBudget } =
    useGetCurrentBudgetQuery();
  const [logExpensesBulk] = useLogExpensesBulkMutation();

  // gets the document count for expense in a day
  const {
    data: countData,
    refetch,
    isFetching: loadingCount,
  } = useGetTodayExpenseCountQuery();

  // sync  backend count to local state
  useEffect(() => {
    if (countData?.count !== undefined) {
      setExpenseCount(countData.count);
    }
  }, [countData]);
  const remainingSlots = 5 - expenseCount;

  // Extract budget info
  const budget = budgetData?.data;
  const isExpired = budgetData?.isExpired;
  const exists = budgetData?.exists;

  // Handle form input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add expense locally
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryName || !form.amount) return;

    if (unsavedExpenses.length >= remainingSlots) {
      setErrorMessage(
        "You've reached the maximum number of expenses you can log today."
      );
      return;
    }

    setUnsavedExpenses([
      ...unsavedExpenses,
      {
        categoryName: form.categoryName,
        amount: Number(form.amount),
        note: form.note,
      },
    ]);

    setForm({ categoryName: "", amount: "", note: "" });
    setErrorMessage("");
  };

  // Delete local expense
  const handleDeleteLocalExpense = (index: number) => {
    const updated = [...unsavedExpenses];
    updated.splice(index, 1);
    setUnsavedExpenses(updated);
  };

  // Save expenses to backend
  const handleSaveExpenses = async () => {
    try {
      const result = await logExpensesBulk(unsavedExpenses).unwrap();
      setSuccessMessage(result.message);
      setUnsavedExpenses([]);
      setShowModal(false);
      setErrorMessage("");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message =
          (err as APIError).data?.message ||
          "Failed to save budget. Please try again";
        setErrorMessage(message);
      } else {
        setErrorMessage("Failed to save budget.Please try again");
      }
    }
  };

  // Auto-clear success message,
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // sync expense document count, and redirect user to dashboard after a successful expense entry.
  useEffect(() => {
    if (successMessage) {
      const refetchTimer = setTimeout(() => {
        refetch(); // Sync count
      }, 300);

      const redirectTimer = setTimeout(() => {
        router.push("/dashboard?refresh=true"); // Navigate added a refresh parameter to it to trigger a refresh once we land on the dashboard, to ensure it stays in sync with our backend.
      }, 1000);

      // ✅ Cleanup both timers
      return () => {
        clearTimeout(refetchTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [successMessage, refetch, router]);

  // Loading state
  if (loadingBudget || loadingCount) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Spinner />
      </main>
    );
  }

  // No budget fallback
  if (!exists) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">
          You don&apos;t have an active budget.
        </p>
        <Link href="/budget" className="text-sunPurple underline font-medium">
          Set up your budget to start tracking expenses
        </Link>
      </div>
    );
  }

  // Expired budget fallback
  if (isExpired) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-semibold mb-4">
          Your budget has expired.
        </p>
        <p className="text-gray-900 font-medium">
          Your budget cycle has ended. You can{" "}
          <Link
            href={"/dashboard"}
            className="text-sunPurple underline font-medium"
          >
            review insights
          </Link>{" "}
          or{" "}
          <Link
            href={"/budget"}
            className="text-sunPurple underline font-medium"
          >
            reset
          </Link>{" "}
          your budget to start fresh.
        </p>
      </div>
    );
  }

  // Maxed out fallback
  if (remainingSlots <= 0) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-semibold mb-4">
          You have reached your maximum expense log for today.
        </p>
        <Link
          href="/dashboard"
          className="text-sunPurple underline font-medium"
        >
          View your full expense log
        </Link>
      </div>
    );
  }

  // Main UI
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-sunPurple mb-6 text-center">
        Log Your Expenses
      </h2>
      {remainingSlots === 5 ? (
        <p className="text-sm text-green-500 mb-3">
          You can only log 5 expenses in a day
        </p>
      ) : (
        <p className="text-sm text-red-500 mb-3">
          {" "}
          You can log {remainingSlots} more expense
          {remainingSlots === 1 ? "" : "s"} today.
        </p>
      )}
      {/* count alert */}
      {successMessage && (
        <p className="text-green-600 text-center mb-4 text-sm">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="text-red-500 mb-4 text-sm">{errorMessage}</p>
      )}

      <form onSubmit={handleAddExpense} className="space-y-4">
        <select
          name="categoryName"
          value={form.categoryName}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sunPurple h-12"
        >
          <option value="">Select Category</option>
          {budget?.categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sunPurple h-12"
        />

        <input
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Optional Note"
          className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sunPurple h-12"
        />

        <button
          type="submit"
          disabled={unsavedExpenses.length >= remainingSlots}
          className={`px-5 py-3 rounded  w-full ${
            unsavedExpenses.length >= remainingSlots
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-sunPurple text-white hover:bg-sunPurple/90"
          }`}
        >
          Add Expense
        </button>
      </form>
      {/* Unsaved Expenses List */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Unsaved Expenses</h3>
        {unsavedExpenses.length === 0 ? (
          <p className="text-gray-500 text-sm">No expenses added yet.</p>
        ) : (
          <ul className="space-y-3">
            {unsavedExpenses.map((exp, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{exp.categoryName}</p>
                  <p className="text-sm text-gray-500">
                    ₦{exp.amount} — {exp.note}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLocalExpense(idx)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Save Button */}
      {unsavedExpenses.length > 0 && (
        <button
          disabled={unsavedExpenses.length > remainingSlots}
          onClick={() => setShowModal(true)}
          className={`mt-6 text-white px-5 py-3 rounded w-full ${
            unsavedExpenses.length > remainingSlots
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Save Expenses
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <SaveExpenseModal
          onCancel={() => setShowModal(false)}
          onConfirm={handleSaveExpenses}
        />
      )}

      {/* Link to Dashboard */}
      <div className="mt-6 text-center">
        <Link
          href="/dashboard"
          className="text-sunPurple underline font-medium"
        >
          View full expense log on dashboard
        </Link>
      </div>
    </div>
  );
};

export default ExpenseSetup;
