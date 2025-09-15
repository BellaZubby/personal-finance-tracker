// creating the budget model
import mongoose, { Schema, Document } from "mongoose";

// define the structure for each category in the budget
export interface Category {
  name: string;
  amount: number;
  spent: number; // tracks how much has been used
}

// define the overall budget document
export interface Budget extends Document {
  userId: string; // links to the authenticated user
  duration: number; // in days
  startDate: Date; // when the budget was created
  categories: Category[];
  isSaved: boolean;
}

// schema for individual categories
const CategorySchema = new Schema<Category>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 },
});

// schema for the full budget
const BudgetSchema = new Schema<Budget>({
  userId: { type: String, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  categories: [CategorySchema],
  isSaved: { type: Boolean, default: false },
});

const Budget = mongoose.model<Budget>("Budget", BudgetSchema);

export default Budget;
