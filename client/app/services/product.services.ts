import { Product } from "../types/product";
import api from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async (
  searchParams?: Record<string, string | string[] | undefined>
): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, value as string);
        }
      }
    });
  }

  const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export const createProduct = async (productData: Partial<Product> | FormData) => {
  const response = await api.post("/api/products", productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product> | FormData) => {
  const response = await api.put(`/api/products/${id}`, productData);
  return response.data as Product;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};
