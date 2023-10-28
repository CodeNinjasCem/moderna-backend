import { Schema, model } from "mongoose";

export const UserRoles = {
    ADMIN: "admin",
    USER: "user",
};


export interface IProduct{
  name: string;
  calories: number;
  price: number;
  proteins: number;
  total_fat: number;
  portions_per_container: number;
}

export const productSchema = new Schema<IProduct>({
  name: {
    type: String,
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

export const ProductModel = model<IProduct>("Product", productSchema);
export default IProduct;
