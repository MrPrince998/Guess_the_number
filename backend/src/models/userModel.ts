import mongoose, { Schema } from "mongoose";

const userModal = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
  },
  userExperience: {
    type: Number,
    default: 0,
    min: 0,
  },
  userCoin: {
    type: Number,
    default: 0,
    min: 0,
  },
  userGamePlayed: {
    type: Number,
    default: 0,
    min: 0,
  },
  userWinStreak: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const User = mongoose.model("User", userModal);
export default User;
