export type Product = {
  _id: string;
  title: string;
  brand: string;
  description?: string;
  price: number;
  mrp?: number;
  discount?: number;
  images: string[];
  category?: string[];
  gender?: string;
  sku?: string;
  stock?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
  createdAt?: string;
}

export type CreateProductPayload = {
  title: string;
  brand: string;
  description?: string;
  price: number;
  mrp?: number;
  discount?: number;
  images: File[];
  category?: string[];
  gender?: string;
  sku?: string;
  stock?: number;
  lowStockThreshold?: number;
  isActive?: boolean;
}
