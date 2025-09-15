"use client"
import ProtectedRoute from '@/app/components/protectedRoute';
import React from 'react';
import DashboardSetup from "./DashboardSetup";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <main  className="min-h-screen bg-gray-50 pt-20 pb-10 font-playfair">
         <DashboardSetup/>
      </main>
    </ProtectedRoute>
   
  )
}

export default Dashboard