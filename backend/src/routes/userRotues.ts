import express from "express";
import userController from "@/controller/userController";
import { authenticateToken } from "@/middleware/authMiddleware";

const router = express.Router();

router.get("/user/profile", authenticateToken, userController.getMyProfile);

export default router;
