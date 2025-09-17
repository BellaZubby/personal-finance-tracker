import { sendEmail } from "./sendEmail";
import { BASE_URL } from "../config/dotenv";

export const sendOTPEmail = async (email: string, otp: string) => {
  const html = `
    <div style="
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    padding: 40px;
    text-align: center;
  ">
    <div style="
      max-width: 500px;
      margin: 0 auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    ">
      <a href="https://akulyst.vercel.app/" style="
        font-size: 24px;
        color: #1d1160;
        font-weight:  800;
        text-align: center;
        margin-bottom: 20px;
      ">AKULYST</a>
      <h2 style="color: #1d1160; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
        Please verify your Email address
      </h2>

      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
        Your account is almost ready. Verify your email address using the OTP below to complete the sign-up process.
      </p>
       <div style="
        font-size: 28px;
        font-weight: bold;
        background-color: #eee;
        padding: 12px 24px;
        border-radius: 6px;
        display: inline-block;
        margin-bottom: 20px;
        letter-spacing: 2px;
      ">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #fb2c36;">
        This OTP expires in 10 minutes.
      </p>
    </div>
  </div>
  `;
  await sendEmail(email, "Your OTP Code", html);
};

export const sendPasswordResetEmail = async (email: string, code: string) => {
  const resetLink = `${BASE_URL}/reset-password?code=${code}`;
  const html = `
    <div style="
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    padding: 40px;
    text-align: center;
  ">
    <div style="
      max-width: 500px;
      margin: 0 auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    ">
      <a href="https://akulyst.vercel.app/" style="
        font-size: 24px;
        color: #1d1160;
        font-weight:  800;
        text-align: center;
        margin-bottom: 20px;
      ">AKULYST</a>
      <h2 style="color: #1d1160;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #333;">
        We received a request to reset your password. Click the button below to proceed:
      </p>
      <a href="${resetLink}" style="
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        border-radius: 10px;
        color: #fff;
        background-color: #1d1160;">Reset Password</a>
        <p style="margin-top: 30px; font-size: 14px; color: #777;">
        If you did not request this, you can safely ignore this email.
      </p>

  `;
  await sendEmail(email, "Password Reset Request", html);
};
