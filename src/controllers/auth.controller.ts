import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await authService.register(email, password);

    return res.status(201).json({
      message: "User registered successfully",
      user: result.user,
      token: result.token,
    });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};
