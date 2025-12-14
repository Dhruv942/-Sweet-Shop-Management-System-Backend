import { Sweet } from "../models/sweet.model";

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
}
