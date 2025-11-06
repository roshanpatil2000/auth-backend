import dotenv from "dotenv"
import { User } from "../models/user.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { permissions } from "../utils/permissions.js";

dotenv.config()

export const getPermissions = async (req, res) => {
    try {
        // Fetch only emails from User collection
        const { userId, email, role } = req;
        console.log({ userId, email, role })
        const allowedActions = permissions[role];
        if (!allowedActions) {
            return errorResponse(res, "No permissions found for this role", 404)
        }

        return successResponse(res, {
            email,
            permissions: allowedActions,
        }, "User permissions fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}
