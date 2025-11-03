import express from "express";
import { login, logout, forgotPassword, signup, verifyEmail, resetPassword, checkAuth, generateAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);
router.post("/generateAuth", generateAuth)
router.get("/check-auth", verifyToken, checkAuth)   // need to hit generateAuth api to generate bearer token and paste token it in auth 
export default router;