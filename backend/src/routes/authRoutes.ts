import express from "express";
import authController from "@/auth/auth";

const router = express.Router();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

export default router;
