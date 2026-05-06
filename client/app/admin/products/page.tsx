"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff, PackagePlus, Save, Search, SlidersHorizontal } from "lucide-react";
import api from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Product } from "../../types/product";

const formatCurrency = (value?: number) =>
  `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`;

export default function AdminProductsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [router, user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/products?includeInactive=true");
      setProducts(res.data);
    } catch (error) {
      console.error("ADMIN_PRODUCTS_ERROR:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      void loadProducts();
    }
  }, [user]);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      [product.title, product.brand, product.sku]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [products, query]);

  const updateInventory = async (product: Product, payload: Partial<Product>) => {
    try {
      setSavingId(product._id);
      const res = await api.put(`/api/products/${product._id}`, payload);
      setProducts((current) =>
        current.map((item) => (item._id === product._id ? res.data : item))
      );
      toast.success("Product updated");
    } catch (error) {
      console.error("UPDATE_INVENTORY_ERROR:", error);
      toast.error("Could not update product");
    } finally {
      setSavingId("");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50/70 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500">Inventory</p>
            <h1 className="text-3xl font-bold text-gray-950">Manage Products</h1>
          </div>
          <Link
            href="/admin/add-products"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-bold text-white hover:bg-gray-900"
          >
            <PackagePlus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, brand, or SKU"
              className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-black focus:bg-white"
            />
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
            <SlidersHorizontal className="h-4 w-4" />
            {filteredProducts.length} products
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_0.8fr] gap-4 border-b border-gray-100 bg-gray-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 md:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Alert</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-gray-500">Loading inventory...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">No products found.</div>
          ) : (
            filteredProducts.map((product) => {
              const isLowStock = (product.stock ?? 0) < (product.lowStockThreshold ?? 5);
              return (
                <div
                  key={product._id}
                  className="grid gap-4 border-b border-gray-100 px-5 py-4 last:border-0 md:grid-cols-[1.5fr_0.7fr_0.7fr_0.7fr_0.8fr] md:items-center"
                >
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/shop/product/${product._id}`}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 transition hover:border-gray-300"
                    >
                      <Image
                        src={product.images?.[0] || "/placeholder.png"}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/shop/product/${product._id}`}
                        className="truncate font-bold text-gray-950 transition hover:underline"
                      >
                        {product.title}
                      </Link>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                      <p className="text-xs text-gray-400">{product.sku || "No SKU"}</p>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(product.price)}
                  </div>

                  <input
                    type="number"
                    min="0"
                    value={product.stock ?? 0}
                    onChange={(event) =>
                      setProducts((current) =>
                        current.map((item) =>
                          item._id === product._id
                            ? { ...item, stock: Number(event.target.value) }
                            : item
                        )
                      )
                    }
                    onBlur={() => updateInventory(product, { stock: product.stock ?? 0 })}
                    className={`h-10 w-28 rounded-lg border px-3 text-sm font-semibold outline-none focus:border-black ${
                      isLowStock ? "border-amber-300 bg-amber-50" : "border-gray-200 bg-white"
                    }`}
                  />

                  <input
                    type="number"
                    min="0"
                    value={product.lowStockThreshold ?? 5}
                    onChange={(event) =>
                      setProducts((current) =>
                        current.map((item) =>
                          item._id === product._id
                            ? { ...item, lowStockThreshold: Number(event.target.value) }
                            : item
                        )
                      )
                    }
                    onBlur={() =>
                      updateInventory(product, {
                        lowStockThreshold: product.lowStockThreshold ?? 5,
                      })
                    }
                    className="h-10 w-28 rounded-lg border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-black"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateInventory(product, { isActive: !(product.isActive ?? true) })
                      }
                      className={`inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold ${
                        product.isActive ?? true
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.isActive ?? true ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      {product.isActive ?? true ? "Active" : "Hidden"}
                    </button>
                    {savingId === product._id && <Save className="h-4 w-4 animate-pulse text-gray-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
