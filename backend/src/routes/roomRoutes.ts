import express from "express";
import roomController from "@/controller/roomController";
import { authenticateToken } from "@/middleware/authMiddleware";

const router = express.Router();

router.post("/create", authenticateToken, roomController.createRoom);
router.post("/join", authenticateToken, roomController.joinRoom);
router.post("/exit", authenticateToken, roomController.exitRoom);
router.post("/start", authenticateToken, roomController.startGameRoom);

export default router;
