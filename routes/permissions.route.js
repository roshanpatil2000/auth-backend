import express from "express";
import { adminToken } from "../middleware/adminToken.middleware.js";
import { getPermissions } from "../controllers/permissions.controllers.js";
const router = express.Router();

router.get("/", adminToken, getPermissions)

export default router;