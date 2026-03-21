import api from "./api";

export type OrderItem = {
  product: string;
  title?: string;
  image?: string;
  quantity: number;
  price?: number;
  lineTotal?: number;
};

export type Order = {
  _id: string;
  items: OrderItem[];
  address?: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  subtotal?: number;
  shipping?: number;
  total?: number;
  paymentMethod?: string;
  status?: string;
  createdAt: string;
};

export const createOrder = async (payload: {
  items: { productId: string; quantity: number }[];
  address: {
    name: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
}) => {
  const res = await api.post("/api/orders", payload);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/api/orders/me");
  return res.data as Order[];
};
