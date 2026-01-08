"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "../store/cart.store";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { items, removeItem } = useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99; 
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-500">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h1>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link
          href="/"
          className="h-12 px-8 bg-black text-white font-semibold rounded-full flex items-center justify-center hover:bg-gray-900 transition-all shadow-lg shadow-black/10 active:scale-95"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Shopping Bag <span className="text-gray-400 font-normal text-lg ml-2">({items.length} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="group flex gap-4 sm:gap-6 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-all"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <Image
              
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    src={(item as any).image || (item as any).images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-contain p-2 mix-blend-multiply"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-2"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <p className="text-sm text-gray-500 mt-1">{(item as any).brand}</p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</span>
                      <span className="font-bold text-gray-900">{item.quantity}</span>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">
                          ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          <div className="lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="font-medium text-gray-900">₹{shipping}</span>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-end">
                  <span className="font-bold text-gray-900 text-base">Order Total</span>
                  <span className="font-bold text-gray-900 text-xl">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full h-12 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900 shadow-lg shadow-black/10 active:scale-95 transition-all"
              >
                CHECKOUT SECURELY
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Secure SSL Encryption</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}