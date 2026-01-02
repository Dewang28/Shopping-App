import { Schema, model, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  brand: string;
  price: number;
  mrp?: number;
  discount?: number;
  description: string;
  category: string[];
  gender?: string;
  images: string[];
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number },
    discount: { type: Number },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      enum: ["men", "women", "kids", "home", "beauty", "genz", "studio"],
      required: true,
    },
    gender: { type: String },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export default model<IProduct>("Product", productSchema);