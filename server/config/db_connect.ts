import mongoose from "mongoose";
import { DB_URI } from "./dotenv";

const connectDB = async () => {
  try {
    // ensures that DB_URI is never undefined but if it is, error is thrown. Because Typescript expects a strict string.
    if (!DB_URI) {
      throw new Error("Missing database URI in the environment variable");
    }
    await mongoose.connect(DB_URI);
    console.log("database connection successful");
  } catch (error) {
    console.log("failed to connect to database", error);
  }
};

export default connectDB;
