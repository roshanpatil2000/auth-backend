import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getMenuItems } from "../controllers/menu.controller.js";


const router = express.Router();
router.post("/", getMenuItems);

export default router;