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
router.post("/join", authMiddleware_1.authenticateToken, roomController_1.default.joinRoom);
router.post("/exit", authMiddleware_1.authenticateToken, roomController_1.default.exitRoom);
router.post("/start", authMiddleware_1.authenticateToken, roomController_1.default.startGameRoom);
router.post("/clear-status", authMiddleware_1.authenticateToken, roomController_1.default.clearPlayerStatus);
router.post("/player-ready", authMiddleware_1.authenticateToken, roomController_1.default.playerReady);
router.post("/player-guess", authMiddleware_1.authenticateToken, roomController_1.default.playerGuess);
router.get("/player-guess-history/:roomCode/:userId", authMiddleware_1.authenticateToken, roomController_1.default.playersGuessHistory);
router.get("/status/:roomCode", authMiddleware_1.authenticateToken, roomController_1.default.getRoomStatus);
router.post("/set-secret-code", authMiddleware_1.authenticateToken, roomController_1.default.setSecretCode);
exports.default = router;
//# sourceMappingURL=roomRoutes.js.map