import dotenv from "dotenv"
import { Menu } from "../models/menuItem.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { convertToLowercase } from "../utils/convertToLowercase.js";
import { Category } from "../models/category.model.js";

dotenv.config()

export const getAllMenuItems = async (req, res) => {
    try {
        const menu = await Menu.find().sort({ sortOrder: 1 })


        return successResponse(res, { total: menu.length, items: menu }, "menu fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}


export const getMenuItemByID = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return errorResponse(res, "item id not found", 400);
        }
        const menu = await Menu.findById(id);
        return successResponse(res, { item: menu }, "menu fetched successfully")

    } catch (error) {
        return errorResponse(res, error.message, 500)
    }

}


export const createMenuItem = async (req, res) => {
    try {
        const {
            name,
            categoryId,
            price,
            taxPercent,
            description,
            modifiers = [],
            isAvailable,
        } = req.body;

        // Validate name
        if (!name || !name.trim()) {
            return errorResponse(res, "Menu item name is required", 400);
        }

        // Validate price
        if (!price || Number(price) <= 0) {
            return errorResponse(res, "Valid price is required", 400);
        }

        // Validate category if provided
        if (categoryId) {
            const categoryExists = await Category.findById(categoryId);
            if (!categoryExists) {
                return errorResponse(res, "Invalid category ID", 400);
            }
        }

        // Normalize name
        const normalizedName = convertToLowercase(name);

        // Validate modifiers
        let formattedModifiers = [];
        if (Array.isArray(modifiers)) {
            formattedModifiers = modifiers
                .filter((m) => m?.name?.trim())
                .map((m) => ({
                    name: convertToLowercase(m.name.trim()),
                    price: m.price ? Number(m.price) : 0,
                }));
        }

        // Optional: Image URL if uploaded
        let imageUrl = null;
        if (req.file) {
            imageUrl = req.file.path; // if using multer or cloud upload
        }

        const item = await Menu.create({
            name: normalizedName,
            categoryId: categoryId || null,
            price: Number(price),
            taxPercent: taxPercent ? Number(taxPercent) : 0,
            description: description || "",
            isAvailable: isAvailable ?? true,
            imageUrl,
            modifiers: formattedModifiers,
            createdBy: req.userId, // if you store the user who added item
        });

        return successResponse(res, item, "Menu item created successfully");
    } catch (error) {
        return errorResponse(res, error.message || "Something went wrong", 500);
    }
};


export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            categoryId,
            price,
            taxPercent,
            description,
            modifiers = [],
            isAvailable,
        } = req.body;

        // Prepare update object
        const updates = {};

        // Name
        if (name !== undefined) {
            if (!name.trim()) {
                return errorResponse(res, "Menu item name cannot be empty", 400);
            }
            updates.name = convertToLowercase(name.trim());
        }

        // Price
        if (price !== undefined) {
            if (Number(price) <= 0) {
                return errorResponse(res, "Valid price is required", 400);
            }
            updates.price = Number(price);
        }

        // Category validation
        if (categoryId !== undefined) {
            if (categoryId) {
                const categoryExists = await Category.findById(categoryId);
                if (!categoryExists) {
                    return errorResponse(res, "Invalid category ID", 400);
                }
            }
            updates.categoryId = categoryId || null;
        }

        // Tax percent
        if (taxPercent !== undefined) {
            updates.taxPercent = Number(taxPercent) || 0;
        }

        // Description
        if (description !== undefined) {
            updates.description = description;
        }

        // Availability
        if (isAvailable !== undefined) {
            updates.isAvailable = isAvailable;
        }

        // Image upload support
        if (req.file) {
            updates.imageUrl = req.file.path;
        }

        // Modifiers
        if (Array.isArray(modifiers)) {
            updates.modifiers = modifiers
                .filter((m) => m?.name?.trim())
                .map((m) => ({
                    name: convertToLowercase(m.name.trim()),
                    price: m.price ? Number(m.price) : 0,
                }));
        }

        // If no fields to update
        if (Object.keys(updates).length === 0) {
            return errorResponse(res, "No valid fields to update", 400);
        }

        // Perform update
        const updatedItem = await Menu.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return errorResponse(res, "Menu item not found", 404);
        }

        return successResponse(res, updatedItem, "Menu item updated successfully");

    } catch (error) {
        return errorResponse(res, error.message || "Something went wrong", 500);
    }
};


export const deleteMenuItem = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return errorResponse(res, "item id not found", 400);
        }
        const menu = await Menu.findByIdAndDelete(id);
        return successResponse(res, null, "item deleted successfully")

    } catch (error) {
        return errorResponse(res, error.message, 500)

    }
}