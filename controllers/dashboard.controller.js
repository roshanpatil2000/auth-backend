import dotenv from "dotenv"
import { User } from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

dotenv.config()

export const getData = async (req, res) => {
    try {
        // Fetch only emails from User collection
        const users = await User.find({}, "email")
        const emails = users.map(user => user.email)

        return successResponse(res, { emails, total: emails.length }, "User emails fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}
