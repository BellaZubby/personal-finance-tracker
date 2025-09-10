import { sendEmail } from './sendEmail';
import { BASE_URL } from '../config/dotenv';


export const sendOTPEmail = async (email: string, otp: string) => {
  const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;
  await sendEmail(email, 'Your OTP Code', html);
};

export const sendPasswordResetEmail = async (
  email: string,
  code: string
) => {
  const resetLink = `${BASE_URL}/reset-password?code=${code}`;
  const html = `
    <p>Click the button below to reset your password:</p>
    <a href="${resetLink}" style="
      display: inline-block;
      padding: 10px 20px;
      background-color: #6A0DAD;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    ">Reset Password</a>
  `;
  await sendEmail(email, 'Password Reset Request', html);
};