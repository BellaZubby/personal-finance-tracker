import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/dotenv";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as unknown as {
      id: string;
      email: string;
    };
    (req.user = decoded), next();
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(403)
        .json({
          message: "Forbidden: Invalid or expired token",
          error: error.message,
        });
    } else {
      return res
        .status(403)
        .json({
          message: "Forbidden: Invalid or expired token",
          error: String(error),
        });
    }
  }
};
