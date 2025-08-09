import jwt from "jsonwebtoken";

export const generateToken = (
  userId: string,
  role: "guest" | "user"
): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ userId, role }, jwtSecret, { expiresIn: "7d" });
};

export const generateRandomUsername = (): string => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `user_${randomString}`;
};

export const generateRandomIds = (length: number = 12): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
