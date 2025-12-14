import { Sweet } from "../models/sweet.model";
import mongoose from "mongoose";

export class SweetService {
  async createSweet(data: {
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
  }) {
    const sweet = await Sweet.create({
      name: data.name,
      category: data.category,
      price: data.price,
      quantityInStock: data.quantity,
      image: data.image,
    });

    return {
      id: sweet._id,
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantityInStock,
      image: sweet.image,
    };
  }

  async getAllSweets() {
    const sweets = await Sweet.find();
    return sweets.map((sweet) => ({
      id: sweet._id,
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantityInStock,
      image: sweet.image,
    }));
  }
  async searchSweets(query: string) {
    const searchConditions: any[] = [
      { name: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ];

    const priceQuery = parseFloat(query);
    if (!isNaN(priceQuery)) {
      searchConditions.push({ price: priceQuery });
    }

    const sweets = await Sweet.find({
      $or: searchConditions,
    });
    return sweets.map((sweet) => ({
      id: sweet._id,
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantityInStock,
      image: sweet.image,
    }));
  }

  async updateSweet(
    id: string,
    data: {
      name?: string;
      category?: string;
      price?: number;
      quantity?: number;
      image?: string;
    }
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Sweet not found");
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.quantity !== undefined) updateData.quantityInStock = data.quantity;
    if (data.image !== undefined) updateData.image = data.image;

    const sweet = await Sweet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    return {
      id: sweet._id,
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantityInStock,
      image: sweet.image,
    };
  }

  async deleteSweet(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Sweet not found");
    }

    const sweet = await Sweet.findByIdAndDelete(id);

    if (!sweet) {
      throw new Error("Sweet not found");
    }

    return { message: "Sweet deleted successfully" };
  }

  async purchaseSweet(id: string, quantity: number) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Sweet not found");
    }

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      throw new Error("Sweet not found");
    }

    if (sweet.quantityInStock < quantity) {
      throw new Error("Insufficient stock");
    }

    sweet.quantityInStock -= quantity;
    await sweet.save();

    return {
      message: "Purchase successful",
      sweet: {
        id: sweet._id,
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantityInStock,
        image: sweet.image,
      },
    };
  }
}
