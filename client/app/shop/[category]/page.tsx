import FilterSidebar from "./../../components/filters/FilterSidebar";
import SortBar from "./../../components/filters/SortBar";
import ProductCard from "./../../components/product/ProductCard";

interface PageProps {
  params: {
    category: string;
  };
}

async function getProductsByCategory(category: string) {
  return [
    {
      id: "1",
      image: "/products/nike-1.png",
      brand: "Nike",
      title: "Men Solid Sneakers",
      price: 2999,
      mrp: 4999,
      discount: 40,
    },
    {
      id: "2",
      image: "/products/nike-2.png",
      brand: "Nike",
      title: "Running Sports Shoes",
      price: 3499,
    },
    {
      id: "3",
      image: "",
      brand: "Puma",
      title: "Casual Wear Shoes",
      price: 2799,
    },
  ];
}

export default async function CategoryPage({ params }: PageProps) {
  const category = params.category;
  const products = await getProductsByCategory(category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-sm text-textSecondary mb-4">
        Home / Clothing /{" "}
        <span className="capitalize font-medium">{category}</span>
      </p>

      <h1 className="text-xl font-semibold mb-6 capitalize">
        {category} Products{" "}
        <span className="text-textSecondary font-normal">
          - {products.length} items
        </span>
      </h1>

      <div className="flex gap-6">
        <aside className="w-64 shrink-0">
          <FilterSidebar />
        </aside>

        <main className="flex-1">
          <SortBar />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
