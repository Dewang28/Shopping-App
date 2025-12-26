import api from "./api";

export const getProducts = async () => {
  const res = await api.get("/api/products");

  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};
