import bcrypt from "bcrypt";
import User from "../models/user";
import { generateOTP } from "../services/otpServices";
import { sendOTPEmail, sendPasswordResetEmail } from "../services/emailService";
import { Request, Response } from "express";
import {
  generateResetToken,
  generateToken,
  generateRefreshToken,
} from "../utils/tokenService";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../config/dotenv";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Budget from "../models/budget";
import Expense from "../models/expense";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await newUser.save();
    await sendOTPEmail(email, otp);

    // Fetch clean user data (excluding sensitive fields)
    const cleanUser = await User.findById(newUser._id).select(
      "-password -otp -otpExpires -resetToken -__v -resetTokenExpires"
    ); // exclude sensitive/internal fields
    //   .lean(); return plain JS object

    // Send response with clean data
    res.status(201).json({
      message:
        "Registration successful. OTP sent! Check your email inbox or spam folder.",
      data: cleanUser,
    });

    // res.status(201).json({message: "Registration successful. OTP sent to email for verification.", data: newUser});
  } catch (error) {
    // res.status(500).json({message: "Registration failed", error: error.message});
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Registration failed", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Registration failed", error: String(error) });
    }
  }
};

// creating the verification controller
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({
          message: "OTP has expired. Please request a new OTP.",
          code: "OTP_EXPIRED",
        }); // code needed to display button for resend only when it is a case of expired otp.
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // generate a token after user is verified
    const accessToken = generateToken(user);

    // store token in http-only cookie
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Generates refresh token
    const refreshToken = generateRefreshToken(user);

    // store also as cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // send user info (no token)

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      // token
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Verification failed", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Verification failed", error: String(error) });
    }
  }
};

// Login endpoint
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({
          message: "User not verified. Please check your email for OTP.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Generates access token
    const accessToken = generateToken(user);

    // store token in http-only cookie
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      // sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Generates refresh token
    const refreshToken = generateRefreshToken(user);

    // store also as cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // send user info (no token)

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      // token
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Login failed", error: error.message });
    } else {
      res.status(500).json({ message: "Login failed", error: String(error) });
    }
  }
};

// RESEND OTP
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOTP(); // OTP generator function
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = expiresAt;

    await user.save();

    await sendOTPEmail(user.email, otp);

    res.status(200).json({ message: "New OTP sent to email" });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({
          message: "Failed to resend OTP. Please try again",
          error: error.message,
        });
    } else {
      res
        .status(500)
        .json({
          message: "Failed to resend OTP. Please try again",
          error: String(error),
        });
    }
  }
};

// FORGOT PASSWORD. Runs when we click the forgot password btn
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { rawToken, hashedToken, code } = generateResetToken();

    console.log("Generated reset token:", hashedToken);

    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    user.rawToken = rawToken; // stores raw token temporarily
    user.resetCode = code;
    user.resetToken = hashedToken;
    user.resetTokenExpires = expires;

    await user.save();

    // await sendPasswordResetEmail(email, rawToken);
    await sendPasswordResetEmail(email, code);

    res
      .status(200)
      .json({
        message: "Password reset link sent!. Check your inbox or spam folder.",
      });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to send reset link", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to send reset link", error: String(error) });
    }
  }
};

// RESOLVE THE RESET CODE INORDER TO RETRIEVE THE ACTUAL PASSWORD RESET TOKEN

export const resolveResetCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({
      resetCode: code,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user || !user.rawToken) {
      return res.status(400).json({ message: "invalid or expired reset link" });
    }

    return res.status(200).json({ email: user.email, token: user.rawToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({
          message: "Invalid or expired reset code",
          error: error.message,
        });
    } else {
      res
        .status(500)
        .json({
          message: "Invalid or expired reset code",
          error: String(error),
        });
    }
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // const {email, token, newPassword} = req.body;
    const { token, newPassword } = req.body;

    // Hash the incoming token to match the stored version
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by email and hashed token, and ensure token hasn't expired
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update user credentials and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    user.rawToken = undefined;
    user.resetCode = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Password reset failed", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Password reset failed", error: String(error) });
    }
  }
};
/**
 *
 * This verifies the refresh token and issues a new login access token
 */
export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET!) as unknown as {
      id: string;
    };

    const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET!, {
      expiresIn: "15m",
    });

    res.cookie("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Invalid refresh token", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Invalid refresh token", error: String(error) });
    }
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Logout failed", error: message });
  }
};

// UPDATING A USER

// Controller to update user's first and/or last name
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract user ID from the decoded JWT
    const userId = req.user?.id;

    // Extract fields to update from request body
    const { firstName, lastName } = req.body;

    // Validate input: at least one field must be provided
    if (!firstName && !lastName) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // Save changes
    await user.save();

    // Respond with updated user info
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Update failed", error: message });
  }
};

// DELETE USER ACCOUNT

// Controller to delete the user's account
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Extract user ID from the decoded JWT
    const userId = req.user?.id;

    // Delete the user from the database
    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Cascade delete: remove all budgets and expenses linked to the user
    await Budget.deleteMany({ userId });
    await Expense.deleteMany({ userId });

    // Respond with confirmation
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Delete failed", error: message });
  }
};
