import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv"
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccess, sendVerficationEmail, sendWelcomeMail } from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";


dotenv.config()
export const signup = async (req, res) => {
    const { email, name, password, role } = req.body;
    try {
        if (!email || !name || !password) {
            return errorResponse(res, "All fields are required", 400);
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return errorResponse(res, "User already exists", 400)
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        // save data in DB
        const user = new User({
            email,
            password: hashedPassword,
            name,
            role: role || "user",
            verificationToken: verificationToken,
            verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        });
        await user.save();

        // jwt token
        generateTokenAndSetCookie(res, user._id, user.role, user.email);
        await sendVerficationEmail(user.email, verificationToken);


        return successResponse(res, {
            user: {
                ...user._doc,
                password: undefined,
                verificationToken: undefined
            }
        }, "User created successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}

export const generateAuth = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, "Invalid credentials", 400);
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return errorResponse(res, "Invalid credentials", 400);
        }

        const data = { token: generateTokenAndSetCookie(res, user._id, user.email, user.role) }

        await user.save();

        return successResponse(res, data, "Data fetched successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }

}
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return errorResponse(res, "Invalid or expired verification code", 400)
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();
        await sendWelcomeMail(user.email, user.name);

        return successResponse(res, {
            user: {
                ...user._doc,
                password: undefined
            }
        }, 'Email verified successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, "Invalid credentials", 400)
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return errorResponse(res, "Invalid credentials", 400)
        }

        const token = generateTokenAndSetCookie(res, user._id, user.role, user.email);

        user.lastLogin = Date.now();
        await user.save();

        return successResponse(res, {
            user: {
                ...user._doc,
                token: token,
                password: undefined
            }
        }, "Login successful");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return successResponse(res, null, "logged out successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return errorResponse(res, "User not found!", 400)
        }
        // geneate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000  //1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        return successResponse(res, null, "Password reset link sent to your email");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } })

        if (!user) {
            return errorResponse(res, "Invalid or expired reset token", 400)
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save()
        await sendResetSuccess(user.email)
        return successResponse(res, null, "password reset successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return errorResponse(res, "User not found!", 400)
        }
        return successResponse(res, { user });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}