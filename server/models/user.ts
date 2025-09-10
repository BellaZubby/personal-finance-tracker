// creating the user schema (model)
import mongoose, {Schema, Document} from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isVerified: boolean;
    otp?: string | undefined;
    otpExpires?: Date | undefined;
    // needed for forgot-password
    resetToken?: string | undefined;
    resetTokenExpires?: Date | undefined;
    resetCode?: String | undefined;
    rawToken?: string | undefined;
}

const UserSchema = new Schema<IUser>({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    otp: {type: String},
    otpExpires: {type: Date},
    resetToken: { type: String, default: null},
    resetTokenExpires: {type: Date, default: null},
    resetCode: {type: String},
    rawToken: {type: String}
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;