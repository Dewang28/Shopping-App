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
}