"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  "/banners/banner-1.png",
  "/banners/banner-2.png",
  "/banners/banner-3.png",
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  
  useEffect(() => {
    if (isHovered) return; 

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(id);
  }, [index, isHovered]);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div 
      className="relative h-full w-full group overflow-hidden rounded-2xl bg-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full">
        <Image
          key={index}
          src={banners[index]}
          alt={`Promotion banner ${index + 1}`}
          fill
          priority
          className="object-cover transition-opacity duration-500 ease-in-out"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/90 hover:text-black text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/90 hover:text-black text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              i === index 
                ? "w-8 h-2 bg-white" 
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}