import mongoose, { Schema } from "mongoose";

const playerStatusSchema = new Schema(
  {
    playerId: {
      type: String, // ✅ CHANGED: Use String instead of Schema.Types.ObjectId
      required: true,
    },
    isPlayerJoined: {
      type: Boolean,
      default: false,
    },
    
    roomCode: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "guest"],
      default: "user",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    isReady: {
      type: Boolean,
      default: false,
    },
    hasTurn: {
      type: Boolean,
      default: false,
    },
    currentGuess: {
      type: Number,
    },
    secretCode: {
      type: Number,
    },
    guessHistory: {
      type: [
        {
          guess: Number,
          result: String, // "higher", "lower", "correct"
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PlayerStatus", playerStatusSchema);
