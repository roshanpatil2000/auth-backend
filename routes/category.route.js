import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js";


const router = express.Router();
router.post("/", createCategory);
router.get("/", getAllCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;