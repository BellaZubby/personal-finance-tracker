import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Category = {
    name: string;
    amount: number;
};

type BudgetState = {
    duration: number | null;
    durationConfirmed: boolean;
    categories: Category[];
    isSaved: boolean;
    error: string;
    startDate: string | null;
}

const initialState: BudgetState = {
    duration: null,
    durationConfirmed: false,
    categories: [],
    isSaved: false,
    error: "",
    startDate: null,
};

const budgetSlice = createSlice({
    name: "budget",
    initialState,
    reducers: {
        // setting budget duration
        setDuration(state, action: PayloadAction<number>) {
            state.duration = action.payload;
        },

        // for confirm duration
        confirmDuration(state) {
            state.durationConfirmed = true;
            state.error = "";
        },

        // adding categories to budget for
        addCategory(state, action: PayloadAction<Category>) {
            // check if we have set a budget for a category, so we dont add it again
            const exists = state.categories.some(cat => cat.name === action.payload.name);
            if (exists) {
               state.error = "You have set budget for this category.";
            } else {
                state.categories.push(action.payload);
                state.error = "";
            }
        },

        // removing an added category
        removeCategory(state, action: PayloadAction<string>) {
            state.categories = state.categories.filter(cat => cat.name !== action.payload);
        },

        // to save our budget cycle
        saveBudget(state) {
            state.isSaved = true;
            state.startDate = new Date().toISOString(); // store saves timestamp of when budget was created
        },

        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },

        resetBudget(state) {
            state.duration = null;
            state.durationConfirmed = false;
            state.categories = [];
            state.isSaved = false;
            state.error = "";
            state.startDate = null;
        },
    },
});

export const {setDuration, confirmDuration, addCategory, removeCategory, saveBudget, setError, resetBudget} = budgetSlice.actions;

export default budgetSlice.reducer;