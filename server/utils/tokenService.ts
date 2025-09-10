// Add JWT Utility
import jwt from "jsonwebtoken"
import { IUser } from "../models/user"
import { JWT_SECRET, REFRESH_SECRET } from "../config/dotenv"
import crypto from "crypto"

// Generates initial access token that is short-lived
export const generateToken = (user:IUser):string => {
    return jwt.sign(
        {id: user._id, email: user.email},
        JWT_SECRET!,
        {expiresIn: "15m"} // token expires in 15 minutes
    );
};

// Generated the refresh token that generates the access token (long-lived)
export const generateRefreshToken = (user:IUser):string => {
    return jwt.sign(
        {id: user._id},
        REFRESH_SECRET!,
        {expiresIn: "7d"} // token expires in 7 days
    );
};

// password reset-token
/**
 * Generates a secure reset token.
 * @returns { rawToken, hashedToken }
 */
export const generateResetToken = (): {rawToken: string; hashedToken: string; code: string} => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const code = crypto.randomBytes(16).toString("hex");
    return {rawToken, hashedToken, code};
}