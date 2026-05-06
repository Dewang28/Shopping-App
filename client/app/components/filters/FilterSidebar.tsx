"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const FILTERS = {
  productTypes: [
    { label: "T-Shirts", value: "t-shirts" },
    { label: "Shirts", value: "shirts" },
    { label: "Jeans", value: "jeans" },
    { label: "Jackets", value: "jackets" },
    { label: "Dresses", value: "dresses" },
    { label: "Activewear", value: "activewear" },
  ],
};

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<{
    category: string[];
  }>({
    category: [],
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setSelectedFilters({
      category: params.getAll("category"),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(type);

    if (currentValues.includes(value)) {
      params.delete(type);
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => params.append(type, v));
    } else {
      params.append(type, value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    router.push(window.location.pathname, { scroll: false });
  };

  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 tracking-tight">FILTERS</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            Clear All
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="space-y-8">
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
            Product Type
          </h4>
          <div className="space-y-3">
            {FILTERS.productTypes.map((item) => (
              <label
                key={item.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.category.includes(item.value)}
                  onChange={() => handleFilterChange("category", item.value)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-black transition-colors select-none">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
