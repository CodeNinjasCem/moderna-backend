import { Schema, model } from "mongoose";

export const UserRoles = {
    ADMIN: "admin",
    USER: "user",
};


export interface Product{
  name: string;
  energetic_content: number;
  calories: number;
  price: number;
  proteins: number;
  total_fat: number;
  portions_per_container: number;
}

export const productSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  energetic_content: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  proteins: {
    type: Number,
    required: true,
  },
  total_fat: {
    type: Number,
    required: true,
  },
  portions_per_container: {
    type: Number,
    required: true,
  },
});

export const ProductModel = model<Product>("Product", productSchema);
export default Product;
