import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv"
import { sendPasswordResetEmail, sendResetSuccess, sendVerficationEmail, sendWelcomeMail } from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";


dotenv.config();

export const createUser = async (req, res) => {
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

    }
    catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // Fetch only emails from User collection
        const users = await User.find({}, "email")
        const emails = users.map(user => user.email)

        return successResponse(res, { total: emails.length, emails }, "User emails fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return errorResponse(res, "User not found!", 400)
        }

        return successResponse(res, user, "User emails fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedUpdates = ["name", "email", "role"];
        const updates = {};
        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }
        // If no valid fields provided
        if (Object.keys(updates).length === 0) {
            return errorResponse(res, "No valid fields to update", 400);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return errorResponse(res, "User not found", 404);
        }

        return successResponse(
            res,
            updatedUser,
            "User updated successfully"
        );
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteUser = await User.findByIdAndDelete(id);

        if (!deleteUser) {
            return errorResponse(res, "User not found", 404);
        }

        return successResponse(
            res, null, "User deleted successfully"
        );
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }

}