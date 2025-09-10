"use client";
import React, {useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "@/app/store/budgetSlice";
import { AppDispatch, RootState } from "@/app/store";

type Props = {
  onAddCategory: (name: string, amount: number) => void;
};

const availableCategories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Others",
];

const CategoryForm = ({ onAddCategory }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  // const [showMessage, setShowMessage] = useState(false);

  // const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: RootState) => state.budget.error);
  const addedCategories = useSelector(
    (state: RootState) => state.budget.categories
  );
  const allAdded = availableCategories.every((cat) =>
    addedCategories.some((added) => added.name === cat)
  );

  const handleSubmit = () => {
    const numericAmount = Number(amount); // ensures amount is a number

    // validation checks
    if (!selectedCategory || !amount) {
      dispatch(setError("Please select a category and enter an amount."));
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      dispatch(setError("Amount must be a positive number."));
      return;
    }

    if (numericAmount > 1000000) {
      dispatch(
        setError("Amount seems too high. Please enter a realistic budget.")
      );
      return;
    }

    // if all checks pass
    onAddCategory(selectedCategory, numericAmount);
    setSelectedCategory("");
    setAmount("");
    // dispatch(setError(""));
  };
  return (
    <div className="mt-8">
      <label className="block text-sm font-medium text-gray-700">
        Select Category
      </label>
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          dispatch(setError(""));
        }}
        className="mt-1 block w-full px-3 py-2 border rounded-md"
      >
        <option value="">-- Select --</option>
        {["Food", "Transportation", "Entertainment", "Others"].map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <label className="block text-sm font-medium text-gray-700 mt-4">
        Amount
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          dispatch(setError(""));
        }}
        className="mt-1 block w-full px-3 py-2 border rounded-md"
      />

      <button
        onClick={handleSubmit}
        className={`${
          allAdded
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-sunPurple text-white hover:bg-sunPurple/90"
        } mt-4 px-4 py-2 rounded`}
      >
        Add Category
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {allAdded && (
        <p className="text-sm text-gray-500 mt-2 transition-opacity duration-300">
          You&apos;ve added all available categories.
        </p>
      )}
    </div>
  );
};

export default CategoryForm;
