import BannerSlider from "./components/BannerSlider";
import Container from "./components/layout/Container";
import ProductCard from "./components/product/ProductCard";
import { getProducts } from "./services/product.services";
import { Product } from "./types/product";

export default async function HomePage() {
  const products: Product[] = await getProducts();
 console.log("PRODUCTS:", products);
  const featured = products.slice(0, 6);

  return (
    <main>
      <section className="bg-muted py-6">
        <Container>
          <div className="h-[500px] bg-white rounded flex items-center justify-center text-textSecondary text-xl font-medium">
            <BannerSlider />
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <h2 className="text-xl font-semibold tracking-wide mb-6">
            RISING STARS
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {featured.map((p) => (
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
        </Container>
      </section>
    </main>
  );
}
