import api from "./api";
import { Product } from "../types/product";

export type CartProduct = Product & { image?: string };

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

export type CartResponse = {
  items: CartItem[];
};

export const getCart = async () => {
  const res = await api.get("/api/cart");
  return res.data as CartResponse;
};

export const syncCart = async (
  items: { productId: string; quantity: number }[]
) => {
  const res = await api.put("/api/cart", { items });
  return res.data as CartResponse;
};

export const clearCart = async () => {
  const res = await api.delete("/api/cart");
  return res.data as CartResponse;
};
