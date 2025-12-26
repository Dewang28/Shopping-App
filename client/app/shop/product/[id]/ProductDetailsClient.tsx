"use client";

import Image from "next/image";
import Container from "../../../components/layout/Container";
import { Product } from "../../../types/product";
import { useCartStore } from "../../../store/cart.store";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ProductDetailsClient({
  product,
}: {
  product: Product;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || ""
  );

  console.log(product);

  return (
    <main className="py-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              {product.images?.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 aspect-[3/4] bg-muted border ${
                    activeImage === img
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={product.title}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>

            <div className="relative flex-1 aspect-[3/4] bg-muted">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain p-6"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-textSecondary">
                  Image unavailable
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 sticky top-24 h-fit">
            <div>
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <p className="mt-1 text-textSecondary uppercase font-medium">
                {product.brand}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xl">
              <span className="font-semibold">₹{product.price}</span>
              {product.mrp && (
                <span className="line-through text-textSecondary">
                  ₹{product.mrp}
                </span>
              )}
              {product.discount && (
                <span className="text-primary font-medium">
                  ({product.discount}% OFF)
                </span>
              )}
            </div>

            <button
              onClick={() => {
                addItem(product);
                toast.success("Added to bag");
              }}
              className="h-12 w-full bg-primary text-white font-semibold rounded"
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}
