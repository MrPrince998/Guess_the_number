import express from "express";
import roomController from "@/controller/roomController";
import { authenticateToken } from "@/middleware/authMiddleware";

const router = express.Router();

router.post("/create", authenticateToken, roomController.createRoom);
router.post("/join", authenticateToken, roomController.joinRoom);
router.post("/exit", authenticateToken, roomController.exitRoom);
router.post("/start", authenticateToken, roomController.startGameRoom);
router.post(
  "/clear-status",
  authenticateToken,
  roomController.clearPlayerStatus
);
router.post("/player-ready", authenticateToken, roomController.playerReady);
router.post("/player-guess", authenticateToken, roomController.playerGuess);
router.get(
  "/player-guess-history/:roomCode/:userId",
  authenticateToken,
  roomController.playersGuessHistory
);
router.get(
  "/status/:roomCode",
  authenticateToken,
  roomController.getRoomStatus
);
router.post(
  "/set-secret-code",
  authenticateToken,
  roomController.setSecretCode
);

export default router;
