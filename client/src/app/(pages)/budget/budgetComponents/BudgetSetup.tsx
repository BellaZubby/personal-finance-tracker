"use client";
import React, { useEffect, useState } from "react";
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
  resetBudget,
} from "@/app/store/budgetSlice";
import BudgetSummary from "./BudgetSummary";
import SaveModal from "@/app/components/SaveModal";
import {
  useCreateBudgetMutation,
  useDeleteBudgetMutation,
  useGetCurrentBudgetQuery,
} from "@/app/utils/budgetApi";
import { Spinner } from "@/app/components/Spinner";
import DeleteModal from "@/app/components/deleteModal";

const BudgetSetup = () => {
  const dispatch = useDispatch();

  // extract my save budget slice
  const [createBudget, { data: responseData, isSuccess }] =
    useCreateBudgetMutation();

  // local states
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [showDeleteBudgetModal, setShowDeleteBudgetModal] = useState(false);

  // fetch current budget from backend
  const {
    data,
    isLoading: budgetLoading,
    refetch, // method used to refetch data from the backend after a successful save.
  } = useGetCurrentBudgetQuery();
  const budget = data?.data;
  const isExpired = data?.isExpired;
  const exists = data?.exists;

  const [deleteBudget] = useDeleteBudgetMutation();

  // select redux state
  const duration = useSelector((state: RootState) => state.budget.duration);
  const durationConfirmed = useSelector(
    (state: RootState) => state.budget.durationConfirmed
  );
  const categories = useSelector((state: RootState) => state.budget.categories);
  const error = useSelector((state: RootState) => state.budget.error);
  const user = useSelector((state: RootState) => state.auth.user);

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

  // Save budget
  const handleSaveBudget = async () => {
    // define expected data
    const payload = {
      duration,
      categories,
    };
    try {
      await createBudget(payload).unwrap();
      dispatch(saveBudget()); // updates local state
      refetch(); // Pulls updated budget into frontend
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message =
          (err as any).data?.message ||
          "Failed to save budget. Please try again";
        dispatch(setError(message));
      } else {
        dispatch(setError("Failed to save budget.Please try again"));
      }
    }
  };

  // DELETE BUDGET
  const handleDeleteBudget = async () => {
    try {
      await deleteBudget().unwrap();
      dispatch(resetBudget());
      setDeleteSuccessMessage("Budget reset successful");

      // Refetch the current budget to update the UI
      refetch();
      setShowDeleteBudgetModal(false);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const message =
          (err as any).data?.message ||
          "Failed to save budget. Please try again";
        dispatch(setError(message));
      } else {
        dispatch(setError("Failed to save budget.Please try again"));
      }
    }
  };

  // displaying the success message
  useEffect(() => {
    if (isSuccess && responseData?.message) {
      setSuccessMessage(responseData.message);

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, responseData]);

  // to auto clear budget reset success message
  useEffect(() => {
    if (deleteSuccessMessage) {
      const timer = setTimeout(() => {
        setDeleteSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccessMessage]);

  // Loading state
  if (budgetLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Spinner />
      </main>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* displaying the create budget success message */}
      {successMessage && (
        <p className="text-green-600 text-center mb-4 font-medium">
          {successMessage}
        </p>
      )}
      {deleteSuccessMessage && (
        <p className="text-green-600 text-center mb-4 font-medium">
          {deleteSuccessMessage}
        </p>
      )}

      {exists && !isExpired ? (
        <>
          {exists && isExpired && (
            <p className="text-red-500 font-semibold text-center mb-4">
              Your budget has expired.
            </p>
          )}
          {budget && (
            <BudgetSummary
              budget={budget}
              onRequestDelete={() => setShowDeleteBudgetModal(true)}
            />
          )}
        </>
      ) : !durationConfirmed ? (
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h1 className="text-sunPurple font-bold sm:text-2xl text-lg mb-3">
              Smart budgeting starts here
            </h1>
            <p className="text-textColor font-medium sm:text-xl text-sm">
              Welcome {user?.firstName}, please set a budget duration to
              proceed!
            </p>
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
            <h1 className="text-sunPurple font-semibold text-xl mb-3">
              Set budget amount for different categories
            </h1>
            <p>🥘 🚌 🎦 🛍️</p>
          </div>
          <CategoryForm onAddCategory={handleAddCategory} />
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <h1 className="text-sunPurple font-semibold text-xl mb-3">
              Set budget amount for different categories
            </h1>
            <p>🥘 🚌 🎦 🛍️</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start justify-center">
            <div>
              <CategoryForm onAddCategory={handleAddCategory} />
              {/* save budget button */}
              <div>
                {!exists && categories.length > 0 && (
                  <button
                    onClick={() => setShowModal(!showModal)}
                    className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Save Budget
                  </button>
                )}
              </div>
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
                    isEditable={!exists}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* budget btn */}
      {showModal && (
        <SaveModal
          modalControl={() => setShowModal(!showModal)}
          onSave={handleSaveBudget}
        />
      )}

      {/* budget reset modal */}
      {showDeleteBudgetModal && (
        <DeleteModal
          onConfirm={handleDeleteBudget}
          onCancel={() => setShowDeleteBudgetModal(false)}
        />
      )}
    </div>
  );
};

export default BudgetSetup;
