import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import budgetReducer from "./budgetSlice";
import { authApi } from "../utils/authApi";
import { budgetApi } from "../utils/budgetApi";

// setting up my store
export const store = configureStore({
  // sets up Redux with the authSlice
  reducer: {
    auth: authReducer, // becomes a key the global state
    budget: budgetReducer,

    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer, // injects RTK Query reducer
    [budgetApi.reducerPath]: budgetApi.reducer, // injects RTK Query reducer
  },

  // combine all RTK Query middlewares
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, budgetApi.middleware), // injects RTK Quert middleware
  // DevTools are enabled by default, but you can explicitly set:
  devTools: process.env.NODE_ENV !== "production",
});

// Typescript helpers

export type RootState = ReturnType<typeof store.getState>; // TypeScript helper for type safety (for state)
export type AppDispatch = typeof store.dispatch; // TypeScript helpers for type safety (for actions)
