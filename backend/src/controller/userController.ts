// controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/userModel.js";

interface AuthRequest extends Request {
  userId?: string;
}

const getMyProfile = async (
  req: AuthRequest,
  res: Response
): Promise<Response | void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      userLevel: user.userLevel,
      userExperience: user.userExperience,
      userCoin: user.userCoin,
      userGamePlayed: user.userGamePlayed,
      userWinStreak: user.userWinStreak,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getMyProfile,
};
