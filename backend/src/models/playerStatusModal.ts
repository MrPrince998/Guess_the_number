import mongoose, { Schema } from "mongoose";

const playerStatus = new Schema({
  playerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
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
    deafult: false,
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
      guess: Number,
      result: String,
      time: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

export default mongoose.model("PlayerStatus", playerStatus);
