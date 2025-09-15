import express, { Request, Response } from "express";
import { PORT } from "./config/dotenv";
import connectDB from "./config/db_connect";
import authRoutes from "./routes/authRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import expenseRoutes from "./routes/expenseRoute";
import historyRoutes from "./routes/historyRoutes";
import dashboardRoutes from "./routes/dashboardRoute";
import cors from "cors";
import cookieParser from "cookie-parser";
// created an instance of the express app.
const app = express();

// allowedOrigins for cors
const allowedOrigins = [
  "https://akulyst.vercel.app",
  "http://localhost:3000" // for local development
]

const startServer = async () => {
  await connectDB(); // connecting to my database

  app.use(
    cors({
      origin: allowedOrigins, // or your deployed frontend URL
      credentials: true, // if you're using cookies or auth headers
    })
  );

  app.use(cookieParser());

  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/budget", budgetRoutes);
  app.use("/api/expense", expenseRoutes);
  app.use("/api/history", historyRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.get("/", (req: Request, res: Response) => {
    res.send("Server is live");
  });

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};
startServer();
