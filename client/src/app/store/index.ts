import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import budgetReducer from "./budgetSlice"
import { authApi } from "../utils/authApi";

// setting up my store
export const store = configureStore({ // sets up Redux with the authSlice
    reducer: {
        auth: authReducer, // becomes a key the global state
        [authApi.reducerPath] : authApi.reducer, // injects RTK Query reducer
        budget: budgetReducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware), // injects RTK Quert middleware
    // DevTools are enabled by default, but you can explicitly set:
    devTools: process.env.NODE_ENV !== 'production',

});

export type RootState = ReturnType<typeof store.getState>; // TypeScript helper for type safety (for state)
export type AppDispatch = typeof store.dispatch; // TypeScript helpers for type safety (for actions)