"use client";
import React, { useState } from "react";
import CategoryForm from "./CategoryForm";
import CategoryCard from "./CategoryCard";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import {
  setDuration,
  confirmDuration,
  addCategory,
  removeCategory,
  saveBudget,
  setError,
} from "@/app/store/budgetSlice";
import BudgetSummary from "./BudgetSummary";
import SaveModal from "@/app/components/SaveModal";

const BudgetSetup = () => {
  const dispatch = useDispatch();

  // local states
  const [showModal, setShowModal] = useState(false);

  // select redux state
  const duration = useSelector((state: RootState) => state.budget.duration);
  const durationConfirmed = useSelector(
    (state: RootState) => state.budget.durationConfirmed
  );
  const categories = useSelector((state: RootState) => state.budget.categories);
  const isBudgetSaved = useSelector((state: RootState) => state.budget.isSaved);
  const error = useSelector((state: RootState) => state.budget.error);
  const user = useSelector((state:RootState) => state.auth.user);

  const handleConfirmDuration = () => {
    if (duration && duration >= 7 && duration <= 30) {
      dispatch(confirmDuration());
    } else {
      dispatch(setError("Duration must be between 7 and 30 days."));
    }
  };

  // handle adding a category
  const handleAddCategory = (name: string, amount: number) => {
    dispatch(addCategory({ name, amount }));
  };

  //   handle removing of categories before final budget save
  const handleDeleteCategory = (name: string) => {
    dispatch(removeCategory(name));
  };
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {isBudgetSaved ? (
        <BudgetSummary />
      ) : !durationConfirmed ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h1 className="text-sunPurple font-bold text-3xl mb-3">Smart budgeting starts here</h1>
            <p className="text-textColor font-medium text-xl">Welcome {user?.firstName}, please set a budget duration to proceed!</p>
          </div>
          <label className="text-lg font-semibold mb-2">
            Set Budget Duration (7–30 days)
          </label>
          <input
            type="number"
            min={7}
            max={30}
            value={duration ?? ""}
            onChange={(e) => dispatch(setDuration(Number(e.target.value)))}
            disabled={durationConfirmed}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sunPurple"
          />
          <button
            onClick={handleConfirmDuration}
            className="mt-4 bg-sunPurple text-white px-4 py-2 rounded hover:bg-sunPurple/90"
          >
            Confirm Duration
          </button>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
           <div className="text-center mb-6">
            <h1 className="text-sunPurple font-semibold text-xl mb-3">Set budget amount for different categories</h1>
            <p>🥘 🚌 🎦 🛍️</p>
            {/* <p className="text-textColor font-medium text-xl">Welcome {user?.firstName}, please set a budget duration to proceed!</p> */}
          </div>
          <CategoryForm onAddCategory={handleAddCategory} />
        </div>
      ) : (
        <div>
           <div className="text-center mb-6">
            <h1 className="text-sunPurple font-semibold text-xl mb-3">Set budget amount for different categories</h1>
            <p>🥘 🚌 🎦 🛍️</p>
            {/* <p className="text-textColor font-medium text-xl">Welcome {user?.firstName}, please set a budget duration to proceed!</p> */}
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start justify-center">
          <div>
            <CategoryForm onAddCategory={handleAddCategory} />
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CategoryCard
                  name={cat.name}
                  amount={cat.amount}
                  onDelete={() => handleDeleteCategory(cat.name)}
                  isEditable={!isBudgetSaved}
                />
              </motion.div>
            ))}
          </div>
        </div>
        </div>
        
      )}
      {/* budget btn */}
      {!isBudgetSaved && categories.length > 0 && (
        <button
          onClick={() => setShowModal(!showModal)}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Budget
        </button>
      )}
      {showModal && <SaveModal onClick = {() => setShowModal(!showModal)}/>}
    </div>
  );
};

export default BudgetSetup;
