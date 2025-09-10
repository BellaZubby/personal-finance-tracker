"use client"

import ProtectedRoute from '@/app/components/protectedRoute'
import React from 'react'

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <main>
         <div className='min-h-screen flex items-center justify-center'>Dashboard</div>
      </main>
    </ProtectedRoute>
   
  )
}

export default Dashboard