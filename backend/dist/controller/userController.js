"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("@/models/userModel"));
const getMyProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ error: "Missing user ID" });
        }
        const user = await userModel_1.default.findById(userId).select("-password");
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
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.default = {
    getMyProfile,
};
//# sourceMappingURL=userController.js.map