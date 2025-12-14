import { Schema, model, Document } from "mongoose";

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantityInStock: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const sweetSchema = new Schema<ISweet>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityInStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

sweetSchema.index({ name: 1, category: 1 }, { unique: true });

export const Sweet = model<ISweet>("Sweet", sweetSchema);
