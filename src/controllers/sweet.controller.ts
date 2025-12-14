import { Response } from "express";
import { SweetService } from "../services/sweet.service";
import { AuthRequest } from "../middleware/auth.middleware";

const sweetService = new SweetService();

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "Name, category, price, and quantity are required",
      });
    }

    const sweet = await sweetService.createSweet({
      name,
      category,
      price,
      quantity,
    });

    return res.status(201).json(sweet);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Failed to create sweet",
    });
  }
};
