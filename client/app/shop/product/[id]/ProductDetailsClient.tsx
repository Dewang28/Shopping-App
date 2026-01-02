"use client";

import Image from "next/image";
import Container from "../../../components/layout/Container";
import { Product } from "../../../types/product";
import { useCartStore } from "../../../store/cart.store";
import toast from "react-hot-toast";
import { useState } from "react";
import { ShoppingBag, Heart, Star, Truck, ShieldCheck } from "lucide-react";

export default function ProductDetailsClient({
  product,
}: {
  product: Product;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || ""
  );
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountValue = product.discount 
    ? product.discount 
    : product.mrp && product.mrp > product.price 
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-white py-10 sm:py-16 animate-fade-in">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6">
            
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible scrollbar-hide">
              {product.images?.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-24 sm:w-24 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === img
                      ? "border-black ring-1 ring-black ring-offset-1"
                      : "border-transparent hover:border-gray-200"
                  } bg-gray-50`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    fill
                    className="object-contain p-2 mix-blend-multiply"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-50">
                  Image unavailable
                </div>
              )}
              
              {/* Discount Badge */}
              {discountValue > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  -{discountValue}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="sticky top-24 h-fit space-y-8">
            
            {/* Header Info */}
            <div className="space-y-2 border-b border-gray-100 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  {product.brand}
                </span>
                
                {/* Mock Rating */}
                <div className="flex items-center gap-1 text-sm font-medium bg-gray-50 px-2 py-1 rounded">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span>4.8</span>
                  <span className="text-gray-400 font-normal">(120 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      Save ₹{(product.mrp - product.price).toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <div className="prose prose-sm text-gray-600">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p>{(product as any).description || "Experience premium quality with this masterfully crafted piece. Designed for modern living, it combines durability with timeless style."}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  addItem(product);
                  toast.success("Added to bag");
                }}
                className="flex-1 h-14 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-all shadow-lg shadow-black/10 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ShoppingBag className="h-5 w-5" />
                ADD TO BAG
              </button>

              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`h-14 w-14 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                  isWishlisted 
                    ? "border-red-200 bg-red-50 text-red-500" 
                    : "border-gray-200 text-gray-900 hover:border-gray-900"
                }`}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Truck className="h-6 w-6 text-gray-900 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Free Shipping</h4>
                  <p className="text-xs text-gray-500 mt-0.5">On all orders over ₹1999</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-gray-900 mt-1" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Secure Payment</h4>
                  <p className="text-xs text-gray-500 mt-0.5">100% secure payment</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </main>
  );
}