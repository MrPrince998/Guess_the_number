"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = __importDefault(require("@/controller/roomController"));
const authMiddleware_1 = require("@/middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/create", authMiddleware_1.authenticateToken, roomController_1.default.createRoom);
router.post("/join", roomController_1.default.joinRoom);
router.delete("/rooms/:roomCode/players/:userId", authMiddleware_1.authenticateToken, roomController_1.default.exitRoom);
router.patch("/rooms/:roomCode/start", authMiddleware_1.authenticateToken, roomController_1.default.startGameRoom);
router.patch("/rooms/:roomCode/players/:userId/ready", authMiddleware_1.authenticateToken, roomController_1.default.playerReady);
router.patch("/rooms/:roomCode/players/:userId/status", authMiddleware_1.authenticateToken, roomController_1.default.clearPlayerStatus);
router.get("/rooms/:roomCode/players/:userId/heartbeat", authMiddleware_1.authenticateToken, roomController_1.default.heartbeat);
router.put("/rooms/:roomCode/players/:userId/guess", authMiddleware_1.authenticateToken, roomController_1.default.playerGuess);
router.patch("/rooms/:roomCode/players/:userId/secret", authMiddleware_1.authenticateToken, roomController_1.default.setSecretCode);
router.get("/rooms/:roomCode/status", authMiddleware_1.authenticateToken, roomController_1.default.getRoomStatus);
router.get("/rooms/:roomCode/players/:userId/guesses", authMiddleware_1.authenticateToken, roomController_1.default.playersGuessHistory);
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map