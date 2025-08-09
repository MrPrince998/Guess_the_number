import { Request, Response } from "express";
import Room from "@/models/roomModel";
import PlayerStatus from "@/models/playerStatusModel";
import { generateRandom4digitNumber } from "@/utils/generateRoomNumber";
import {
  generateRandomIds,
  generateRandomUsername,
  generateToken,
} from "@/utils/generateToken";

const createRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const roomCode = generateRandom4digitNumber();

    const newRoom = new Room({
      roomCode: roomCode,
      isActiveRoom: true,
      players: [userId],
    });

    const savedRoom = await newRoom.save();

    // Create PlayerStatus with roomCode
    const playerStatus = new PlayerStatus({
      isPlayerJoined: true,
      playerId: userId,
      roomCode: savedRoom.roomCode,
      role: "user",
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
        role: savedPlayerStatus.role,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const joinRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { roomCode, userId } = req.body;

    if (!roomCode) {
      return res
        .status(400)
        .json({ error: "Room code and User ID are required" });
    }

    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.players.length >= 2) {
      return res.status(400).json({ error: "Room is full" });
    }

    let playerId = userId;
    let guestUsername;
    let guestToken;
    let role = "user";

    if (!userId) {
      playerId = generateRandomIds(12);
      guestUsername = generateRandomUsername();
      guestToken = generateToken(playerId, "guest");
      role = "guest";
    }

    if (room.players.includes(playerId)) {
      return res.status(400).json({ error: "User already in room" });
    }

    room.players.push(playerId);
    const updatedRoom = await room.save();

    // Create PlayerStatus with roomCode
    const playerStatus = new PlayerStatus({
      playerId: playerId,
      isPlayerJoined: true,
      roomCode: roomCode,
      role: role,
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
        role: savedPlayerStatus.role,
      },
      ...(guestToken && {
        token: guestToken,
        username: guestUsername,
      }),
    });
  } catch (error) {
    console.error("Error joining room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const startGameRoom = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomCode, userId } = req.body; // Remove playerNumber dependency
    if (!roomCode || !userId) {
      return res.status(400).json({
        error: "Room code and User ID are required",
      });
    }

    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if requesting user is in the room
    if (!room.players.includes(userId)) {
      return res.status(400).json({
        error: "You are not in this room",
      });
    }

    // Check actual player count in room
    if (room.players.length < 2) {
      return res.status(400).json({
        error:
          "At least 2 players are required to start the game. Current players: " +
          room.players.length,
      });
    }

    if (room.isGameStarted) {
      return res.status(400).json({
        error: "Game has already started",
      });
    }

    // Check if all players in room are ready
    const playersStatus = await PlayerStatus.find({
      roomCode,
      playerId: { $in: room.players },
    });

    // Verify all players have PlayerStatus records
    if (playersStatus.length !== room.players.length) {
      return res.status(400).json({
        error:
          "Not all players have joined properly. Please ensure all players have joined the room.",
      });
    }

    // Check if all players are ready and have secret codes
    const unreadyPlayers = playersStatus.filter(
      (status) => !status.isReady || !status.secretCode
    );

    if (unreadyPlayers.length > 0) {
      return res.status(400).json({
        error: `Cannot start game. ${unreadyPlayers.length} player(s) are not ready or haven't set their secret code.`,
      });
    }

    // All validations passed, start the game
    const updatedRoom = await Room.findByIdAndUpdate(
      room._id,
      { isGameStarted: true },
      { new: true }
    );

    // Set first player's turn (optional)
    await PlayerStatus.findOneAndUpdate(
      { roomCode, playerId: room.players[0] },
      { hasTurn: true }
    );

    return res.status(200).json({
      message: "Game started successfully",
      room: {
        id: updatedRoom?._id,
        roomCode: updatedRoom?.roomCode,
        isGameStarted: updatedRoom?.isGameStarted,
        players: updatedRoom?.players,
      },
    });
  } catch (error) {
    console.error("Error starting game:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const exitRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { roomCode, userId } = req.body;
    if (!roomCode || !userId) {
      return res
        .status(400)
        .json({ error: "Room code and User ID are required" });
    }

    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (!room.players.includes(userId)) {
      return res.status(400).json({ error: "User not in room" });
    }

    // Remove player from room
    room.players = room.players.filter(
      (player) => player.toString() !== userId
    );

    // Remove player status - this clears their game state
    await PlayerStatus.deleteOne({ playerId: userId, roomCode });

    // If room becomes empty, delete the entire room
    if (room.players.length === 0) {
      // Clean up all PlayerStatus records for this room
      await PlayerStatus.deleteMany({ roomCode });
      await Room.deleteOne({ _id: room._id });

      return res.status(200).json({
        message: "Room deleted as no players left",
        roomDeleted: true,
      });
    }

    // If game was started and only 1 player remains, reset game state
    if (room.isGameStarted && room.players.length === 1) {
      room.isGameStarted = false;

      // Reset remaining player's status
      await PlayerStatus.updateMany(
        { roomCode },
        {
          isReady: false,
          hasTurn: false,
          currentGuess: null,
          $unset: { secretCode: 1 }, // Remove secretCode
          $set: { guessHistory: [] }, // Clear guess history
        }
      );
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
  } catch (error) {
    console.error("Error exiting room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const playerReady = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { roomCode, userId } = req.body;
    if (!roomCode || !userId) {
      return res
        .status(400)
        .json({ error: "Room code and User ID are required" });
    }

    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (!room.players.includes(userId)) {
      return res.status(400).json({ error: "User not in room" });
    }

    const playerStatus = await PlayerStatus.findOne({
      playerId: userId,
      roomCode,
    });

    if (!playerStatus) {
      return res.status(404).json({ error: "Player status not found" });
    }

    // Check if secretCode exists and is not null/undefined
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
  } catch (error) {
    console.error("Error marking player as ready:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const clearPlayerStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomCode, userId } = req.body;

    if (!roomCode || !userId) {
      return res
        .status(400)
        .json({ error: "Room code and User ID are required" });
    }

    const playerStatus = await PlayerStatus.findOne({
      playerId: userId,
      roomCode,
    });

    if (!playerStatus) {
      return res.status(404).json({ error: "Player status not found" });
    }

    // Reset player status to initial state
    const clearedStatus = await PlayerStatus.findByIdAndUpdate(
      playerStatus._id,
      {
        isReady: false,
        hasTurn: false,
        currentGuess: null,
        $unset: { secretCode: 1 }, // Remove secretCode
        $set: { guessHistory: [] }, // Clear guess history
      },
      { new: true }
    );

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
  } catch (error) {
    console.error("Error clearing player status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const playerGuess = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { roomCode, userId, guess } = req.body;

    if (!roomCode || !userId || guess === undefined) {
      return res
        .status(400)
        .json({ error: "Room code, User ID, and guess are required" });
    }

    const playerStatus = await PlayerStatus.findOne({
      playerId: userId,
      roomCode,
    });

    if (!playerStatus) {
      return res.status(404).json({ error: "Player status not found" });
    }

    // Update player's current guess and add to guess history
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
  } catch (error) {
    console.error("Error submitting guess:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const playersGuessHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomCode, userId } = req.body;

    if (!roomCode || !userId) {
      return res
        .status(400)
        .json({ error: "Room code and User ID are required" });
    }

    const playerStatus = await PlayerStatus.findOne({
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
  } catch (error) {
    console.error("Error retrieving player guess history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getRoomStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomCode } = req.params;

    if (!roomCode) {
      return res.status(400).json({ error: "Room code is required" });
    }

    const room = await Room.findOne({ roomCode });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Get all player statuses for this room
    const playersStatus = await PlayerStatus.find({
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
        role: status.role || "user",
      })),
      canStartGame:
        room.players.length >= 2 &&
        playersStatus.length === room.players.length &&
        playersStatus.every((s) => s.isReady && s.secretCode) &&
        !room.isGameStarted,
    });
  } catch (error) {
    console.error("Error getting room status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const setSecretCode = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { roomCode, userId, secretCode } = req.body;

    if (!roomCode || !userId || !secretCode) {
      return res.status(400).json({
        error: "Room code, User ID, and secret code are required",
      });
    }

    // Validate secret code (4 digits)
    if (!/^\d{4}$/.test(secretCode.toString())) {
      return res.status(400).json({
        error: "Secret code must be exactly 4 digits",
      });
    }

    const playerStatus = await PlayerStatus.findOne({
      playerId: userId,
      roomCode,
    });

    if (!playerStatus) {
      return res.status(404).json({ error: "Player status not found" });
    }

    // Update secret code
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
  } catch (error) {
    console.error("Error setting secret code:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
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
