import express from "express";
import {
  deleteUser,
  forgotPassword,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resendOTP,
  resetPassword,
  resolveResetCode,
  updateUser,
  verifyOTP,
} from "../controllers/authController";
import { otpResendLimiter, passwordResetLimiter } from "../middleware/rateLimiter";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/verification", verifyOTP);
router.post("/signin", loginUser);
router.post("/resend-otp", otpResendLimiter, resendOTP);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logoutUser);
router.post("/resolve-code", resolveResetCode);
router.patch("/update-user", authenticateJWT, updateUser);
router.delete("/delete-user", authenticateJWT, deleteUser);
export default router;
