import Container from "../components/layout/Container";
import ProductCard from "../components/product/ProductCard";
import { getProducts } from "../services/product.services";
import { Product } from "../types/product";
export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="py-8">
      <Container>
        <div className="flex gap-8">
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="border border-border rounded p-4 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">CATEGORIES</h3>
                <ul className="space-y-2 text-sm text-textSecondary">
                  {["T-Shirts", "Shirts", "Jeans", "Shoes"].map((c) => (
                    <li key={c} className="cursor-pointer hover:text-primary">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-lg font-semibold">Products</h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {products.map((p: Product) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  image={
                    Array.isArray(p.images) && p.images.length
                      ? p.images[0]
                      : "/placeholder.png"
                  }
                  brand={p.brand}
                  title={p.title}
                  price={p.price}
                  mrp={p.mrp}
                  discount={p.discount}
                />
              ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
