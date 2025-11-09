import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createMenuItem, deleteMenuItem, getAllMenuItems, getMenuItemByID, updateMenuItem } from "../controllers/menu.controller.js";


const router = express.Router();
router.get("/", getAllMenuItems);
router.post("/", createMenuItem)
router.put("/:id", updateMenuItem)
router.get("/:id", getMenuItemByID)
router.delete("/:id", deleteMenuItem)

export default router;