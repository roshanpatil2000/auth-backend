import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllCategories } from "../controllers/category.controller.js";


const router = express.Router();
router.post("/", getAllCategories);

export default router;