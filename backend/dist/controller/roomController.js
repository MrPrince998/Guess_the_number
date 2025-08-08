"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomModel_1 = __importDefault(require("@/models/roomModel"));
const playerStatusModel_1 = __importDefault(require("@/models/playerStatusModel"));
const generateRoomNumber_1 = require("@/utils/generateRoomNumber");
const createRoom = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const roomCode = (0, generateRoomNumber_1.generateRandom4digitNumber)();
        const newRoom = new roomModel_1.default({
            roomCode: roomCode,
            isActiveRoom: true,
            players: [userId],
        });
        const savedRoom = await newRoom.save();
        const playerStatus = new playerStatusModel_1.default({
            isPlayerJoined: true,
            playerId: userId,
            roomCode: savedRoom.roomCode,
        });
        const savedPlayerStatus = await playerStatus.save();
        return res.status(201).json({
            message: "Room created successfully",
            room: {
                id: savedRoom._id,
                roomCode: savedRoom.roomCode,
                players: savedRoom.players,
                isActiveRoom: savedRoom.isActiveRoom,
            },
            playerStatus: {
                id: savedPlayerStatus._id,
                playerId: savedPlayerStatus.playerId,
                isPlayerJoined: savedPlayerStatus.isPlayerJoined,
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
        if (!roomCode || !userId) {
            return res
                .status(400)
                .json({ error: "Room code and User ID are required" });
        }
        const room = await roomModel_1.default.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        if (room.players.length >= 2) {
            return res.status(400).json({ error: "Room is full" });
        }
        if (room.players.includes(userId)) {
            return res.status(400).json({ error: "User already in room" });
        }
        room.players.push(userId);
        const updatedRoom = await room.save();
        const playerStatus = new playerStatusModel_1.default({
            playerId: userId,
            isPlayerJoined: true,
            roomCode: roomCode,
        });
        const savedPlayerStatus = await playerStatus.save();
        return res.status(200).json({
            message: "Joined room successfully",
            room: {
                id: updatedRoom._id,
                roomCode: updatedRoom.roomCode,
                players: updatedRoom.players,
                isActiveRoom: updatedRoom.isActiveRoom,
            },
            playerStatus: {
                id: savedPlayerStatus._id,
                playerId: savedPlayerStatus.playerId,
                isPlayerJoined: savedPlayerStatus.isPlayerJoined,
            },
        });
    }
    catch (error) {
        console.error("Error joining room:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const startGameRoom = async (req, res) => {
    try {
        const { roomCode, userId } = req.body;
        if (!roomCode || !userId) {
            return res.status(400).json({
                error: "Room code and User ID are required",
            });
        }
        const room = await roomModel_1.default.findOne({ roomCode });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        if (!room.players.includes(userId)) {
            return res.status(400).json({
                error: "You are not in this room",
            });
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
        const unreadyPlayers = playersStatus.filter((status) => !status.isReady || !status.secretCode);
        if (unreadyPlayers.length > 0) {
            return res.status(400).json({
                error: `Cannot start game. ${unreadyPlayers.length} player(s) are not ready or haven't set their secret code.`,
            });
        }
        const updatedRoom = await roomModel_1.default.findByIdAndUpdate(room._id, { isGameStarted: true }, { new: true });
        await playerStatusModel_1.default.findOneAndUpdate({ roomCode, playerId: room.players[0] }, { hasTurn: true });
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
        const { roomCode, userId } = req.body;
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
        const { roomCode, userId } = req.body;
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
        const playersStatus = await playerStatusModel_1.default.find({
            roomCode,
            playerId: { $in: room.players },
        }).populate("playerId", "username");
        return res.status(200).json({
            room: {
                id: room._id,
                roomCode: room.roomCode,
                isActiveRoom: room.isActiveRoom,
                isGameStarted: room.isGameStarted,
                playersCount: room.players.length,
            },
            players: playersStatus.map((status) => ({
                id: status.playerId,
                isReady: status.isReady,
                hasSecretCode: !!status.secretCode,
                isJoined: status.isPlayerJoined,
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
};
//# sourceMappingURL=roomController.js.map