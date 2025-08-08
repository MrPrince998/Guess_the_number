import { Document } from "mongoose";

export interface AuthRequest extends Request {
  userId?: string;
}

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  gamesPlayed: number;
  gamesWon: number;
  bestScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGame extends Document {
  _id: string;
  userId: string;
  targetNumber: number;
  guesses: number[];
  attempts: number;
  isCompleted: boolean;
  isWon: boolean;
  startTime: Date;
  endTime?: Date;
  difficulty: "easy" | "medium" | "hard";
  range: {
    min: number;
    max: number;
  };
}

export interface IGameSession {
  gameId: string;
  userId: string;
  targetNumber: number;
  attempts: number;
  maxAttempts: number;
  guesses: number[];
  isCompleted: boolean;
  isWon: boolean;
  difficulty: "easy" | "medium" | "hard";
  range: {
    min: number;
    max: number;
  };
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
  };
}

export interface GuessResponse {
  message: string;
  feedback: "too_high" | "too_low" | "correct" | "game_over";
  attemptsLeft: number;
  isGameComplete: boolean;
  isWon: boolean;
  targetNumber?: number;
}
