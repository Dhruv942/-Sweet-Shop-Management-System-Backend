import { Sweet } from "../models/sweet.model";

export class SweetService {
  async createSweet(data: {
    name: string;
    category: string;
    price: number;
    quantity: number;
  }) {
    const sweet = await Sweet.create({
      name: data.name,
      category: data.category,
      price: data.price,
      quantityInStock: data.quantity,
    });

    return {
      id: sweet._id,
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantityInStock,
    };
  }
}

