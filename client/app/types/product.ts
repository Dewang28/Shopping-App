export interface Product {
  _id: string;
  title: string;
  brand: string;
  description?: string;
  price: number;
  mrp?: number;
  discount?: number;
  images: string[];
}
