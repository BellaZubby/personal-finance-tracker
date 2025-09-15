import mongoose, { Schema, Document } from "mongoose";

export interface Expense extends Document {
  userId: string;
  categoryName: string;
  amount: number;
  note?: string;
  date: Date;
}

const ExpenseSchema = new Schema<Expense>({
  userId: { type: String, required: true },
  categoryName: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String },
  date: { type: Date, default: Date.now, required: true },
});

const Expense = mongoose.model<Expense>("Expense", ExpenseSchema);

export default Expense;
