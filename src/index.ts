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
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://sweet-shop-management-system-fronte-topaz.vercel.app",
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.endsWith("/")
        ? origin.slice(0, -1)
        : origin;

      const isAllowed = allowedOrigins.some((allowed) => {
        const normalizedAllowed = allowed?.endsWith("/")
          ? allowed.slice(0, -1)
          : allowed;
        return normalizedOrigin === normalizedAllowed;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
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
