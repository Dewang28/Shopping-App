import { Product } from "../types/product";

export interface ProductFilters {
  category?: string;
  gender?: string;
  brand?: string;
}

export const getProducts = async (
  filters?: ProductFilters
): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};
