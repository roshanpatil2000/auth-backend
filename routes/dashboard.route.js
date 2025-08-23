import express from "express";
import { getData } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/", verifyToken, getData)

export default router;