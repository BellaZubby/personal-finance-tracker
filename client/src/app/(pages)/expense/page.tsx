import ProtectedRoute from '@/app/components/protectedRoute'
import React from 'react'

const ExpensePage = () => {
  return (
    <ProtectedRoute>
        <main>ExpensePage</main>
    </ProtectedRoute>
    
  )
}

export default ExpensePage