import { Request, Response } from "express";
import Room from "@/models/roomModel";
import PlayerStatus from "@/models/playerStatusModal";
import { generateRandom4digitNumber } from "@/utils/generateRoomNumber";

const createRoom = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const roomCode = generateRandom4digitNumber();

    const playerStatus = new PlayerStatus({
      isPlayerJoined: true,
      playerId: userId,
    });

    const newRoom = new Room({
      roomCode: roomCode,
      isActiveRoom: true,
      players: [userId],
    });
    const savedRoom = await newRoom.save();
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
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const joinRoom = async (req: Request, res: Response): Promise<Response> => {
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
    if (room.players.length >= 2) {
      return res.status(400).json({ error: "Room is full" });
    }
    if (room.players.includes(userId)) {
      return res.status(400).json({ error: "User already in room" });
    }
    room.players.push(userId);
    const playerStatus = new PlayerStatus({
      playerId: userId,
      isPlayerJoined: true,
    });

    const updatedRoom = await room.save();
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
    const { roomCode, playerNumber } = req.body;
    if (!roomCode) {
      return res.status(400).json({ error: "Room code is required" });
    }
    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (playerNumber < 2) {
      return res
        .status(400)
        .json({ error: "At least 2 players are required to start the game" });
    }

    if (room.isGameStarted) {
      return res.status(400).json({ error: "Game has already started" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      room._id,
      { isGameStarted: true },
      { new: true }
    );
    return res.status(200).json({
      message: "Game started successfully",
      room: {
        isGameStarted: updatedRoom?.isGameStarted,
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
    room.players = room.players.filter(
      (player) => player.toString() !== userId
    );
    if (room.players.length === 0) {
      await Room.deleteOne({ _id: room._id });
      return res
        .status(200)
        .json({ message: "Room deleted as no players left" });
    }
    const updatedRoom = await room.save();
    return res.status(200).json({
      message: "Exited room successfully",
      room: {
        id: updatedRoom._id,
        roomCode: updatedRoom.roomCode,
        players: updatedRoom.players,
        isActiveRoom: updatedRoom.isActiveRoom,
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

    if (playerStatus?.secretCode === null) {
      return res
        .status(400)
        .json({ error: "You should enter your secret code first" });
    }
    if (!playerStatus) {
      return res.status(404).json({ error: "Player status not found" });
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

export default {
  createRoom,
  joinRoom,
  startGameRoom,
  exitRoom,
  playerReady,
};
