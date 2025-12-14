import { Response } from "express";
import { SweetService } from "../services/sweet.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { Sweet } from "../models/sweet.model";

const sweetService = new SweetService();

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, price, quantity, image } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      quantity === undefined ||
      !image
    ) {
      return res.status(400).json({
        message: "Name, category, price, quantity, and image are required",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({
        message: "Price must be a non-negative number",
      });
    }

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({
        message: "Quantity must be a non-negative number",
      });
    }
    if (await Sweet.findOne({ name })) {
      return res.status(409).json({
        message: "Sweet already exists",
      });
    }
    const sweet = await sweetService.createSweet({
      name,
      category,
      price,
      quantity,
      image,
    });

    return res.status(201).json(sweet);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Failed to create sweet",
    });
  }
};
