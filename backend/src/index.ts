import "module-alias/register";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import userRoutes from "./routes/userRoutes";
import roomRouter from "./routes/roomRoutes";
import authRoutes from "./routes/authRoutes";
import { setupSwagger } from "./swagger";

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL as string;

// Routes
app.use("/api", userRoutes);
app.use("/api/room", roomRouter);

// Auth routes
app.use("/api", authRoutes);

// Setup Swagger
setupSwagger(app);

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });
