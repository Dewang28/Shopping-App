import api from "./api";

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
