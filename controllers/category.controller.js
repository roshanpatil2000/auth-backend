import mongoose from "mongoose";
import dotenv from "dotenv"
import { Category } from "../models/category.model.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { convertToLowercase } from "../utils/convertToLowercase.js";

dotenv.config()

export const getAllCategories = async (req, res) => {
    try {
        const category = await Category.find({}, "name _id").sort({ sortOrder: 1 })


        return successResponse(res, { total: category.length, category }, "categories fetched successfully")
    } catch (error) {
        return errorResponse(res, error.message, 500)
    }
}


export const createCategory = async (req, res) => {
    try {
        const { name, sortOrder } = req.body;
        if (!name || !name.trim()) {
            return errorResponse(res, "Category name is required", 400);
        }

        // Check if already exists
        const existing = await Category.findOne({ name: convertToLowercase(name) });
        if (existing) {
            return errorResponse(res, "Category already exists", 409);
        }

        const category = await Category.create({
            name: convertToLowercase(name),
            sortOrder: sortOrder || 0,
        });

        return successResponse(res, category, "Category created successfully");
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};


export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sortOrder } = req.body || {};

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return errorResponse(res, "Invalid category ID", 400);
        }

        // Prepare updates object
        const updates = {};

        if (typeof name === "string") {
            const normalized = convertToLowercase(name);

            if (!normalized) {
                return errorResponse(res, "Category name cannot be empty", 400);
            }

            updates.name = normalized;
        }

        if (typeof sortOrder !== "undefined") {
            updates.sortOrder = sortOrder;
        }

        // Check if nothing to update
        if (Object.keys(updates).length === 0) {
            return errorResponse(res, "No valid fields to update", 400);
        }

        // Duplicate name check (excluding current category)
        if (updates.name) {
            const duplicate = await Category.findOne({
                name: updates.name,
                _id: { $ne: id },
            });

            if (duplicate) {
                return errorResponse(res, "Category name already taken", 409);
            }
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("_id name sortOrder updatedAt");

        if (!updatedCategory) {
            return errorResponse(res, "Category not found", 404);
        }

        return successResponse(
            res,
            updatedCategory,
            "Category updated successfully"
        );
    } catch (error) {
        return errorResponse(res, error.message || "Something went wrong", 500);
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);

        if (!deleteCategory) {
            return errorResponse(res, "Category not found", 404);
        }

        return successResponse(
            res, null, "Category deleted successfully"
        );
    } catch (error) {
        return errorResponse(res, error.message || "Something went wrong", 500);
    }
}