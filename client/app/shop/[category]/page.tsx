import FilterSidebar from "./../../components/filters/FilterSidebar";
import SortBar from "./../../components/filters/SortBar";
import ProductCard from "./../../components/product/ProductCard";
import { getProducts } from "../../services/product.services";
import { Product } from "../../types/product";
import Link from "next/link";
import { SearchX } from "lucide-react";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: PageProps) {
  
  const { category } = await params;
  
  const products: Product[] = await getProducts({ category });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 animate-fade-in">
          <Link href="/" className="hover:text-black transition-colors duration-200">
            Home
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-900 font-medium capitalize">{category}</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-6 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 capitalize tracking-tight">
            {category} <span className="text-gray-400 font-light">Collection</span>
          </h1>
          <span className="text-sm font-medium text-gray-500 mt-2 sm:mt-0 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            {products.length} Products Found
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="mb-6">
              <SortBar />
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    image={p.images?.[0] || "/placeholder.png"}
                    brand={p.brand}
                    title={p.title}
                    price={p.price}
                    mrp={p.mrp}
                    discount={p.discount}
                  />
                ))}
              </div>
            ) : (
              
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <SearchX className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                  We couldnt find any products in the <span className="capitalize font-medium text-black">{category}</span> category.
                </p>
                <Link 
                  href="/"
                  className="mt-6 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}