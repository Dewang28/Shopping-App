"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest Arrivals", value: "newest" },
];

export default function SortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get("sort") || "recommended";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end gap-3 w-full">
      <span className="text-sm text-gray-500 font-medium hidden sm:inline-block">
        Sort by:
      </span>
      
      <div className="relative group">
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="appearance-none bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-40 sm:w-48 p-2.5 pr-8 cursor-pointer hover:border-gray-300 transition-colors outline-none shadow-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 group-hover:text-gray-600 transition-colors">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}