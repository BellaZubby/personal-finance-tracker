import dotenv from "dotenv"

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const DB_URI = process.env.DB_URI;
export const EMAIL_CLIENT_ID = process.env.EMAIL_CLIENT_ID;
export const EMAIL_CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET;
export const EMAIL_REDIRECT_URI = process.env.EMAIL_REDIRECT_URI;
export const EMAIL_REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN;
export const EMAIL_ACCESS_TOKEN = process.env.EMAIL_ACCESS_TOKEN;
export const EMAIL_USER = process.env.EMAIL_USER;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const REFRESH_SECRET = process.env.REFRESH_SECRET;

