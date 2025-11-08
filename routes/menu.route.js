import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { addMenuItem, getMenuItems } from "../controllers/menu.controller.js";


const router = express.Router();
router.get("/", getMenuItems);
router.post("/add-item", addMenuItem)

export default router;