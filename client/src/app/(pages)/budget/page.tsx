"use client";
import ProtectedRoute from "@/app/components/protectedRoute";
import React from "react";
import BudgetSetup from "./budgetComponents/BudgetSetup";

const BudgetPage = () => {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50 py-28 px-4 font-inter">
        <BudgetSetup />
      </main>
    </ProtectedRoute>
  );
};

export default BudgetPage;
