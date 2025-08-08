import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import userRoutes from "@/routes/userRotues";
import roomrouter from "@/routes/roomRoutes";

// Load env variables
dotenv.config();
console.log("MONGO_URI:", process.env.Moongodb_URL);
console.log("MONGO_URI:", process.env.PORT);

const app = express();
app.use(express.json());

const PORT = process.env.PORT;
const Moongodb_URL = process.env.Moongodb_URL as string;

// Root route
app.use("/api", userRoutes);
app.use("/api/room", roomrouter);

// Connect to MongoDB
mongoose
  .connect(Moongodb_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start server only after DB connects
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Optional: crash the app if DB fails
  });
