import { getProductById } from "@/app/services/product.services";
import ProductDetailsClient from "./ProductDetailsClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  return <ProductDetailsClient product={product} />;
}
