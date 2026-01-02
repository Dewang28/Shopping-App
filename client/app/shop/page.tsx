import Container from "../components/layout/Container";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/filters/FilterSidebar";
import SortBar from "../components/filters/SortBar";
import { getProducts } from "../services/product.services";
import { Product } from "../types/product";
import Link from "next/link";
import { SearchX } from "lucide-react";


interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  
  const resolvedParams = await searchParams;

  const products: Product[] = await getProducts(resolvedParams);

  return (
    <main className="min-h-screen bg-white pb-12">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-100 py-10 mb-8">
        <Container>
          <div className="max-w-xl">
             <nav className="flex items-center text-sm text-gray-500 mb-4 animate-fade-in">
              <Link href="/" className="hover:text-black transition-colors duration-200">
                Home
              </Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-gray-900 font-medium">Shop</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              All Products
            </h1>
            <p className="text-gray-500 text-lg">
              Explore our latest collections and timeless essentials.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-500">
                Showing {products.length} results
              </span>
              <SortBar />
            </div>

            {/* Product */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    id={p._id}
                    image={
                      Array.isArray(p.images) && p.images.length
                        ? p.images[0]
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        : (p as any).image || "/placeholder.png"
                    }
                    brand={p.brand}
                    title={p.title}
                    price={p.price}
                    mrp={p.mrp}
                    discount={p.discount}
                  />
                ))}
              </div>
            ) : (
              
              <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <SearchX className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">
                  We couldnt find any items matching your current filters. Try clearing them to see more results.
                </p>
                <Link 
                  href="/shop"
                  className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}