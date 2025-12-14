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

export const getSweets = async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await sweetService.getAllSweets();
    return res.status(200).json(sweets);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to fetch sweets",
    });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(200).json([]);
    }
    const sweets = await sweetService.searchSweets(query);
    return res.status(200).json(sweets);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to search sweets",
    });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, image } = req.body;

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      return res.status(400).json({
        message: "Price must be a non-negative number",
      });
    }

    if (
      quantity !== undefined &&
      (typeof quantity !== "number" || quantity < 0)
    ) {
      return res.status(400).json({
        message: "Quantity must be a non-negative number",
      });
    }

    const sweet = await sweetService.updateSweet(id, {
      name,
      category,
      price,
      quantity,
      image,
    });

    return res.status(200).json(sweet);
  } catch (error: any) {
    if (error.message === "Sweet not found") {
      return res.status(404).json({
        message: "Sweet not found",
      });
    }
    return res.status(400).json({
      message: error.message || "Failed to update sweet",
    });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await sweetService.deleteSweet(id);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Sweet not found") {
      return res.status(404).json({
        message: "Sweet not found",
      });
    }
    return res.status(400).json({
      message: error.message || "Failed to delete sweet",
    });
  }
};
