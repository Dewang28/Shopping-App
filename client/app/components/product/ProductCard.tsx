"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toggleWishlist, getWishlist } from "../../services/wishlist.services";

interface Props {
  image?: string;
  brand: string;
  title: string;
  price: number;
  mrp?: number;
  discount?: number;
  id?: string;
}


type WishlistItem = string | { _id: string };

export default function ProductCard({
  image,
  brand,
  title,
  price,
  mrp,
  discount,
  id,
}: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const checkStatus = async () => {
      try {
        const data = await getWishlist();
        const exists = data?.products?.some((p: WishlistItem) => 
          (typeof p === 'string' ? p : p._id) === id
        );
        setIsWishlisted(!!exists);
      } catch {
      }
    };
    checkStatus();
  }, [id]);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (!id) return;

    try {
      setLoading(true);
      setIsWishlisted((prev) => !prev);
      await toggleWishlist(id);
    } catch {
      setIsWishlisted((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <>
      <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden rounded-t-xl">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 bg-gray-50">
            No Image
          </div>
        )}

        {/* Heart Button */}
        <button
          onClick={handleWishlistClick}
          disabled={loading}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isWishlisted ? "#ef4444" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={isWishlisted ? "#ef4444" : "currentColor"}
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>

        {discount && discount > 0 && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-red-600 shadow-sm">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {brand}
        </h3>

        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
          {title}
        </p>

        <div className="mt-auto pt-2 flex items-baseline gap-2 text-sm">
          <span className="font-bold text-gray-900">
            ₹{price.toLocaleString("en-IN")}
          </span>
          
          {mrp && mrp > price && (
            <span className="text-xs text-gray-400 line-through decoration-gray-400">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </>
  );

  const wrapperClass = 
    "group relative flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-200 transition-all duration-300";

  if (!id) {
    return <div className={wrapperClass}>{content}</div>;
  }

  return (
    <Link href={`/shop/product/${id}`} className={wrapperClass}>
      {content}
    </Link>
  );
}