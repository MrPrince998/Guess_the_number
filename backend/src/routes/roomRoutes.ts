import express from "express";
import roomController from "@/controller/roomController";
import { authenticateToken } from "@/middleware/authMiddleware";

const router = express.Router();

// The JSDoc comments have been moved to /docs/roomDocs.yaml
router.post("/create", authenticateToken, roomController.createRoom);
router.post("/join", roomController.joinRoom);
router.delete(
  "/rooms/:roomCode/players/:userId",
  authenticateToken,
  roomController.exitRoom
); // exit room

router.patch(
  "/rooms/:roomCode/start",
  authenticateToken,
  roomController.startGameRoom
); // start game
router.patch(
  "/rooms/:roomCode/players/:userId/ready",
  authenticateToken,
  roomController.playerReady
); // mark ready
router.patch(
  "/rooms/:roomCode/players/:userId/status",
  authenticateToken,
  roomController.clearPlayerStatus
); // clear/reset status
router.get(
  "/rooms/:roomCode/players/:userId/heartbeat",
  authenticateToken,
  roomController.heartbeat
); // heartbeat
router.put(
  "/rooms/:roomCode/players/:userId/guess",
  authenticateToken,
  roomController.playerGuess
); // submit guess
router.put(
  "/rooms/:roomCode/players/:userId/secret",
  authenticateToken,
  roomController.setSecretCode
); // set secret code

router.get(
  "/rooms/:roomCode/status",
  authenticateToken,
  roomController.getRoomStatus
); // room status
router.get(
  "/rooms/:roomCode/players/:userId/guesses",
  authenticateToken,
  roomController.playersGuessHistory
); // guess history

export default router;
