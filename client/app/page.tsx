import BannerSlider from "./components/BannerSlider";
import Container from "./components/layout/Container";
import ProductCard from "./components/product/ProductCard";
import { getProducts } from "./services/product.services";
import { Product } from "./types/product";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const products: Product[] = await getProducts(resolvedParams);
  
  const allProducts = Array.isArray(products) ? products : [];
  const featured = allProducts.slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      <section className="py-8 sm:py-10 border-b border-gray-100">
        <Container>
          <div className="h-[500px] w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center relative">
            <BannerSlider />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50/50">
        <Container>
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              RISING STARS
            </h2>
            <div className="w-16 h-1 bg-black rounded-full mb-4 opacity-80"></div>
            <p className="text-gray-500 max-w-2xl text-lg">
              Our most coveted pieces of the season, curated just for you.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {featured.length > 0 ? (
              featured.map((p) => (
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
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No products found
              </div>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}