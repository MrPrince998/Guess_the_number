"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomIds = exports.generateRandomUsername = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, role) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({ userId, role }, jwtSecret, { expiresIn: "7d" });
};
exports.generateToken = generateToken;
const generateRandomUsername = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `user_${randomString}`;
};
exports.generateRandomUsername = generateRandomUsername;
const generateRandomIds = (length = 12) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
exports.generateRandomIds = generateRandomIds;
//# sourceMappingURL=generateToken.js.map