import mongoose, { Schema } from "mongoose";

const playerStatusSchema = new Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomCode: {
      type: String,
      required: true,
    },
    secretCode: {
      type: Number,
      required: false,
    },
    isPlayerJoined: {
      type: Boolean,
      default: false,
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
      default: null,
    },
    guessHistory: [
      {
        guess: {
          type: Number,
          required: true,
        },
        result: {
          type: String,
          required: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add compound index for efficient queries
playerStatusSchema.index({ playerId: 1, roomCode: 1 }, { unique: true });

const PlayerStatus = mongoose.model("PlayerStatus", playerStatusSchema);
export default PlayerStatus;
