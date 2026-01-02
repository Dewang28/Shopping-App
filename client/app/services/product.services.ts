import api from "./api";

export interface ProductFilters {
  category?: string;
  gender?: string;
  brand?: string;
}

export const getProducts = async (filters?: ProductFilters) => {
  const res = await api.get("/api/products", {
    params: filters
  });

  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};