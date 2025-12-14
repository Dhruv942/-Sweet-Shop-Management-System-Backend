import express, { Application, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { connectDB } from "./config/database";

import authRoutes from "./routes/auth.routes";
import sweetRoutes from "./routes/sweet.routes";
const app: Application = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "sweet shop management system ",
    status: "running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
