import dotenv from "dotenv"
import { Category } from "../models/category.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

dotenv.config()

export const getAllCategories = async (req, res) => {
    try {
        const category = await Category.find({}, "name")
        const categoryItems = menu.map(c => c.name)

        return successResponse(res, { total: categoryItems.length, category }, "categories fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}
