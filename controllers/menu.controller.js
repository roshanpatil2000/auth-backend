import dotenv from "dotenv"
import { Menu } from "../models/menuItem.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

dotenv.config()

export const getMenuItems = async (req, res) => {
    try {
        const menu = await Menu.find({}, "name")
        const menuItems = menu.map(menu => menu.name)

        return successResponse(res, { total: menuItems.length, menu }, "menu fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}
