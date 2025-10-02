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
  
  // CORS: Cross-Origin Resource Sharing - Allows frontend to make calls to the backend, especially when on different origins
  app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
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
