import express from "express";
import { adminToken } from "../middleware/adminToken.middleware.js";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/users.controller.js";
const router = express.Router();

router.post("/createUser", adminToken, createUser)
router.get("/", adminToken, getAllUsers)
router.get("/:id", adminToken, getUserById)
router.put("/:id", adminToken, updateUser)
router.delete("/:id", adminToken, deleteUser)

export default router;