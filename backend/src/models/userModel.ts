import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username must be less than 20 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    userLevel: {
      type: Number,
      default: 1,
      min: [1, "Level cannot be less than 1"],
      max: [100, "Level cannot be more than 100"],
    },
    userExperience: {
      type: Number,
      default: 0,
      min: [0, "Experience cannot be negative"],
    },
    userCoin: {
      type: Number,
      default: 0,
      min: [0, "Coins cannot be negative"],
    },
    userGamePlayed: {
      type: Number,
      default: 0,
      min: [0, "Games played cannot be negative"],
    },
    userWinStreak: {
      type: Number,
      default: 0,
      min: [0, "Win streak cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
