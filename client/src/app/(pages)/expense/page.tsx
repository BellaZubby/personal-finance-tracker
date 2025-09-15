"use client";
import ProtectedRoute from "@/app/components/protectedRoute";
import React from "react";
import ExpenseSetup from "./ExpenseView";

const ExpensePage = () => {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-28 px-4 font-inter">
        <ExpenseSetup />
      </main>
    </ProtectedRoute>
  );
};

export default ExpensePage;
