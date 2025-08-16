"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomModel_1 = __importDefault(require("@/models/roomModel"));
const playerStatusModel_1 = __importDefault(require("@/models/playerStatusModel"));
const generateRoomNumber_1 = require("@/utils/generateRoomNumber");
const generateToken_1 = require("@/utils/generateToken");
const userModel_1 = __importDefault(require("@/models/userModel"));
const mongoose_1 = require("mongoose");
const createRoom = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("Creating room for userId:", userId);
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const roomCode = (0, generateRoomNumber_1.generateRandom4digitNumber)();
        const newRoom = new roomModel_1.default({
            roomCode: roomCode,
            isActiveRoom: true,
            players: [userId],
            roomCreator: userId,
        });
        const savedRoom = await newRoom.save();
        const playerStatus = new playerStatusModel_1.default({
            isPlayerJoined: true,
            playerId: userId,
            roomCode: savedRoom.roomCode,
            role: "user",
            isReady: true,
            lastSeen: Date.now(),
        });
        const savedPlayerStatus = await playerStatus.save();
        return res.status(201).json({
            message: "Room created successfully",
            room: {
                id: savedRoom._id,
                roomCode: savedRoom.roomCode,
                roomCreator: savedRoom.roomCreator,
                players: savedRoom.players,
                playersCount: savedRoom.players.length,
                isActiveRoom: savedRoom.isActiveRoom,
            },
            playerStatus: {
                id: savedPlayerStatus._id,
                playerId: savedPlayerStatus.playerId,
                isPlayerJoined: savedPlayerStatus.isPlayerJoined,
                role: savedPlayerStatus.role,
                isReady: savedPlayerStatus.isReady,
            },
        });
    }
    catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const joinRoom = async (req, res) => {
    try {
        const { roomCode, userId } = req.body;
        let playerId = typeof userId === "string" ? userId.trim() : "";
        const isGuestLike = !playerId || playerId.startsWith("guest_");
        console.log("Join room request:", {
            roomCode,
            incomingUserId: userId,
            normalizedPlayerId: playerId,
            isGuestLike,
        });
        if (!roomCode) {
            return res.status(400).json({ error: "Room code is required" });
        }
        const room = await roomModel_1.default.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        if (!room.isActiveRoom) {
            return res.status(400).json({ error: "Room is not active" });
        }
        if (room.players.length >= 2) {
            return res.status(400).json({ error: "Room is full" });
        }
        if (room.isGameStarted) {
            return res.status(400).json({ error: "Game has already started" });
        }
        let guestUsername;
        let guestToken;
        let role = "user";
        if (isGuestLike) {
            if (!playerId || !playerId.startsWith("guest_")) {
                playerId = `guest_${Date.now()}_${Math.random()
                    .toString(36)
                    .slice(2, 10)}`;
            }
            guestUsername = (0, generateToken_1.generateRandomUsername)();
            guestToken = (0, generateToken_1.generateToken)(playerId, "guest");
            role = "guest";
            console.log("Guest identified/created:", { playerId, guestUsername });
        }
        else {
            if (!mongoose_1.Types.ObjectId.isValid(playerId)) {
                return res
                    .status(400)
                    .json({ error: "Invalid user ID format (expected ObjectId)" });
            }
            const user = await userModel_1.default.findById(playerId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
        }
        if (room.players.includes(playerId)) {
            return res.status(400).json({ error: "User already in room" });
        }
        room.players.push(playerId);
        const updatedRoom = await room.save();
        const playerStatus = new playerStatusModel_1.default({
            playerId,
            isPlayerJoined: true,
            roomCode,
            role,
            lastSeen: Date.now(),
            isReady: false,
            hasTurn: false,
            guessHistory: [],
        });
        const savedPlayerStatus = await playerStatus.save();
        const response = {
            message: "Joined room successfully",
            room: {
                id: updatedRoom._id,
                roomCode: updatedRoom.roomCode,
                players: updatedRoom.players,
                isActiveRoom: updatedRoom.isActiveRoom,
                isGameStarted: updatedRoom.isGameStarted || false,
                playersCount: updatedRoom.players.length,
            },
            playerStatus: {
                id: savedPlayerStatus._id,
                playerId: savedPlayerStatus.playerId,
                isPlayerJoined: savedPlayerStatus.isPlayerJoined,
                isReady: savedPlayerStatus.isReady,
                role: savedPlayerStatus.role,
            },
        };
        if (role === "guest" && guestToken && guestUsername) {
            response.token = guestToken;
            response.username = guestUsername;
        }
        return res.status(200).json(response);
    }
    catch (error) {
        console.error("Error in joinRoom:", error);
        return res.status(500).json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
const startGameRoom = async (req, res) => {
    try {
        const { roomCode } = req.params;
        const room = await roomModel_1.default.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        if (room.players.length < 2) {
            return res.status(400).json({
                error: "At least 2 players are required to start the game. Current players: " +
                    room.players.length,
            });
        }
        if (room.isGameStarted) {
            return res.status(400).json({
                error: "Game has already started",
            });
        }
        const playersStatus = await playerStatusModel_1.default.find({
            roomCode,
            playerId: { $in: room.players },
        });
        if (playersStatus.length !== room.players.length) {
            return res.status(400).json({
                error: "Not all players have joined properly. Please ensure all players have joined the room.",
            });
        }
        const updatedRoom = await roomModel_1.default.findByIdAndUpdate(room._id, { isGameStarted: true }, { new: true });
        return res.status(200).json({
            message: "Game started successfully",
            room: {
                id: updatedRoom?._id,
                roomCode: updatedRoom?.roomCode,
                isGameStarted: updatedRoom?.isGameStarted,
                players: updatedRoom?.players,
            },
        });
    }
    catch (error) {
        console.error("Error starting game:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const exitRoom = async (req, res) => {
    try {
        const { roomCode, userId } = req.params;
        if (!roomCode || !userId) {
            return res
                .status(400)
                .json({ error: "Room code and User ID are required" });
        }
        const room = await roomModel_1.default.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        if (!room.players.includes(userId)) {
            return res.status(400).json({ error: "User not in room" });
        }
        room.players = room.players.filter((player) => player.toString() !== userId);
        await playerStatusModel_1.default.deleteOne({ playerId: userId, roomCode });
        if (room.players.length === 0) {
            await playerStatusModel_1.default.deleteMany({ roomCode });
            await roomModel_1.default.deleteOne({ _id: room._id });
            return res.status(200).json({
                message: "Room deleted as no players left",
                roomDeleted: true,
            });
        }
        if (room.isGameStarted && room.players.length === 1) {
            room.isGameStarted = false;
            await playerStatusModel_1.default.updateMany({ roomCode }, {
                isReady: false,
                hasTurn: false,
                currentGuess: null,
                $unset: { secretCode: 1 },
                $set: { guessHistory: [] },
            });
        }
        const updatedRoom = await room.save();
        return res.status(200).json({
            message: "Exited room successfully",
            room: {
                id: updatedRoom._id,
                roomCode: updatedRoom.roomCode,
                players: updatedRoom.players,
                isActiveRoom: updatedRoom.isActiveRoom,
                isGameStarted: updatedRoom.isGameStarted,
            },
        });
    }
    catch (error) {
        console.error("Error exiting room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const playerReady = async (req, res) => {
    try {
        const { roomCode, userId } = req.params;
        if (!roomCode || !userId) {
            return res
                .status(400)
                .json({ error: "Room code and User ID are required" });
        }
        const room = await roomModel_1.default.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        if (!room.players.includes(userId)) {
            return res.status(400).json({ error: "User not in room" });
        }
        const playerStatus = await playerStatusModel_1.default.findOne({
            playerId: userId,
            roomCode,
        });
        if (!playerStatus) {
            return res.status(404).json({ error: "Player status not found" });
        }
        if (!playerStatus.secretCode) {
            return res
                .status(400)
                .json({ error: "You should enter your secret code first" });
        }
        playerStatus.isReady = true;
        const updatedPlayerStatus = await playerStatus.save();
        return res.status(200).json({
            message: "Player is ready",
            playerStatus: {
                id: updatedPlayerStatus._id,
                playerId: updatedPlayerStatus.playerId,
                isReady: updatedPlayerStatus.isReady,
            },
        });
    }
    catch (error) {
        console.error("Error marking player as ready:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const clearPlayerStatus = async (req, res) => {
    try {
        const { roomCode, userId } = req.body;
        if (!roomCode || !userId) {
            return res
                .status(400)
                .json({ error: "Room code and User ID are required" });
        }
        const playerStatus = await playerStatusModel_1.default.findOne({
            playerId: userId,
            roomCode,
        });
        if (!playerStatus) {
            return res.status(404).json({ error: "Player status not found" });
        }
        const clearedStatus = await playerStatusModel_1.default.findByIdAndUpdate(playerStatus._id, {
            isReady: false,
            hasTurn: false,
            currentGuess: null,
            $unset: { secretCode: 1 },
            $set: { guessHistory: [] },
        }, { new: true });
        return res.status(200).json({
            message: "Player status cleared successfully",
            playerStatus: {
                id: clearedStatus?._id,
                playerId: clearedStatus?.playerId,
                isPlayerJoined: clearedStatus?.isPlayerJoined,
                isReady: clearedStatus?.isReady,
                hasTurn: clearedStatus?.hasTurn,
            },
        });
    }
    catch (error) {
        console.error("Error clearing player status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const playerGuess = async (req, res) => {
    try {
        const { roomCode, userId, guess } = req.body;
        if (!roomCode || !userId || guess === undefined) {
            return res
                .status(400)
                .json({ error: "Room code, User ID, and guess are required" });
        }
        const playerStatus = await playerStatusModel_1.default.findOne({
            playerId: userId,
            roomCode,
        });
        if (!playerStatus) {
            return res.status(404).json({ error: "Player status not found" });
        }
        playerStatus.currentGuess = guess;
        playerStatus.guessHistory.push(guess);
        const updatedPlayerStatus = await playerStatus.save();
        return res.status(200).json({
            message: "Guess submitted successfully",
            playerStatus: {
                id: updatedPlayerStatus._id,
                playerId: updatedPlayerStatus.playerId,
                currentGuess: updatedPlayerStatus.currentGuess,
                guessHistory: updatedPlayerStatus.guessHistory,
            },
        });
    }
    catch (error) {
        console.error("Error submitting guess:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const playersGuessHistory = async (req, res) => {
    try {
        const { roomCode, userId } = req.params;
        if (!roomCode || !userId) {
            return res
                .status(400)
                .json({ error: "Room code and User ID are required" });
        }
        const playerStatus = await playerStatusModel_1.default.findOne({
            playerId: userId,
            roomCode,
        });
        if (!playerStatus) {
            return res.status(404).json({ error: "Player status not found" });
        }
        return res.status(200).json({
            message: "Player guess history retrieved successfully",
            guessHistory: playerStatus.guessHistory,
        });
    }
    catch (error) {
        console.error("Error retrieving player guess history:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const getRoomStatus = async (req, res) => {
    try {
        const { roomCode } = req.params;
        if (!roomCode) {
            return res.status(400).json({ error: "Room code is required" });
        }
        const room = await roomModel_1.default.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        const activeSince = new Date(Date.now() - 30 * 1000);
        const playersStatus = await playerStatusModel_1.default.find({
            roomCode,
            playerId: { $in: room.players },
            lastSeen: { $gte: activeSince },
        }).populate("playerId", "username");
        const offlinePlayers = await playerStatusModel_1.default.find({
            roomCode,
            playerId: { $in: room.players },
            lastSeen: { $lt: activeSince },
        });
        if (offlinePlayers.length > 0) {
            await Promise.all(offlinePlayers.map(async (offline) => {
                const playerId = offline.playerId;
                await playerStatusModel_1.default.deleteOne({ playerId, roomCode });
                await roomModel_1.default.updateOne({ roomCode }, { $pull: { players: playerId } });
            }));
        }
        const remainingPlayers = await playerStatusModel_1.default.find({ roomCode });
        if (remainingPlayers.length === 0) {
            await playerStatusModel_1.default.deleteMany({ roomCode });
            await roomModel_1.default.deleteOne({ _id: room._id });
        }
        return res.status(200).json({
            room: {
                id: room._id,
                roomCode: room.roomCode,
                roomCreator: room.roomCreator,
                isActiveRoom: room.isActiveRoom,
                isGameStarted: room.isGameStarted,
                playersCount: room.players.length,
            },
            players: playersStatus.map((status) => ({
                id: status.playerId,
                isReady: status.isReady,
                hasSecretCode: !!status.secretCode,
                isJoined: status.isPlayerJoined,
                role: status.role || "user",
                lastSeen: status.lastSeen,
            })),
            canStartGame: room.players.length >= 2 &&
                playersStatus.length === room.players.length &&
                playersStatus.every((s) => s.isReady && s.secretCode) &&
                !room.isGameStarted,
        });
    }
    catch (error) {
        console.error("Error getting room status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const setSecretCode = async (req, res) => {
    try {
        const { roomCode, userId, secretCode } = req.body;
        if (!roomCode || !userId || !secretCode) {
            return res.status(400).json({
                error: "Room code, User ID, and secret code are required",
            });
        }
        if (!/^\d{4}$/.test(secretCode.toString())) {
            return res.status(400).json({
                error: "Secret code must be exactly 4 digits",
            });
        }
        const playerStatus = await playerStatusModel_1.default.findOne({
            playerId: userId,
            roomCode,
        });
        if (!playerStatus) {
            return res.status(404).json({ error: "Player status not found" });
        }
        playerStatus.secretCode = parseInt(secretCode);
        const updatedPlayerStatus = await playerStatus.save();
        return res.status(200).json({
            message: "Secret code set successfully",
            playerStatus: {
                id: updatedPlayerStatus._id,
                playerId: updatedPlayerStatus.playerId,
                hasSecretCode: !!updatedPlayerStatus.secretCode,
            },
        });
    }
    catch (error) {
        console.error("Error setting secret code:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const heartbeat = async (req, res) => {
    try {
        const { roomCode, userId } = req.params;
        if (!roomCode || !userId) {
            return res
                .status(400)
                .json({ error: "Room code and User ID are required" });
        }
        const playerStatus = await playerStatusModel_1.default.findOneAndUpdate({ roomCode, playerId: userId }, { lastSeen: Date.now() }, { new: true, upsert: true });
        if (!playerStatus) {
            return res.status(404).json({ error: "Player not found in this room" });
        }
        return res.status(200).json({ message: "Heartbeat updated" });
    }
    catch (error) {
        console.error("Error updating heartbeat:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.default = {
    createRoom,
    joinRoom,
    startGameRoom,
    exitRoom,
    playerReady,
    clearPlayerStatus,
    playerGuess,
    playersGuessHistory,
    getRoomStatus,
    setSecretCode,
    heartbeat,
};
//# sourceMappingURL=roomController.js.map