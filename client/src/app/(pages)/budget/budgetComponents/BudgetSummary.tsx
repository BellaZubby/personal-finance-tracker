import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { format, addDays } from "date-fns";
import { BudgetData } from "@/app/utils/budgetApi";
import Link from "next/link";

type Props = {
  budget: BudgetData;
  onRequestDelete: () => void;
};

const BudgetSummary = ({ budget, onRequestDelete }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!budget.startDate || !budget.duration) return null;

  const formattedStart = format(new Date(budget.startDate), "PPP"); // Formatting budget start date
  const formattedEnd = format(
    addDays(new Date(budget.startDate), budget.duration),
    "PPP"
  ); // formatting the end date, obtained by adding duration to start date.
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-sunPurple font-semibold sm:text-xl text-lg mb-3">
          Budget set—smart moves ahead. You&apos;ve got this {user?.firstName}{" "}
          ☺️
        </h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-sunPurple mb-4">
          Your Budget Summary
        </h2>

        <div className="text-sm text-gray-700 mb-4">
          <p>
            <strong>Start Date:</strong> {formattedStart}
          </p>
          <p>
            <strong>End Date:</strong> {formattedEnd}
          </p>
          <p className="mt-2 text-red-500 text-sm">
            You cannot edit this budget. To set a new one, you must delete the
            current budget.
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-md font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            {budget.categories.map((cat) => (
              <li key={cat.name} className="flex justify-between border-b pb-1">
                <span>{cat.name}</span>
                <span className="font-semibold text-sunPurple">
                  ₦{cat.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onRequestDelete}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
        >
          Delete Budget & Set New
        </button>
      </div>
      <Link href={"/expense"} className="cursor-pointer">
        <button
          className={
            "bg-plum mt-5 text-black px-6 py-3 rounded-full text-md font-semibold shadow-md hover:bg-amber hover:text-gray-700 transition-colors duration-500 ease-in-out cursor-pointer"
          }
        >
          Log Daily Expense
        </button>
      </Link>
    </div>
  );
};

export default BudgetSummary;
