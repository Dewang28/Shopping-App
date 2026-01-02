import Link from "next/link";
import Image from "next/image";

interface Props {
  image?: string;
  brand: string;
  title: string;
  price: number;
  mrp?: number;
  discount?: number;
  id?: string;
}

export default function ProductCard({
  image,
  brand,
  title,
  price,
  mrp,
  discount,
  id,
}: Props) {
  const content = (
    <>
      {/* Image Container*/}
      <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden rounded-t-xl">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 bg-gray-50">
            No Image
          </div>
        )}

        {/* Discount */}
        {discount && discount > 0 && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-red-600 shadow-sm">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col gap-1 flex-1">
        {/* Brand Name */}
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {brand}
        </h3>

        {/* Product Title */}
        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.5rem]">
          {title}
        </p>

        {/* Pricing Area */}
        <div className="mt-auto pt-2 flex items-baseline gap-2 text-sm">
          <span className="font-bold text-gray-900">
            ₹{price.toLocaleString("en-IN")}
          </span>
          
          {mrp && mrp > price && (
            <span className="text-xs text-gray-400 line-through decoration-gray-400">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </>
  );

  // Wrapper Styles
  const wrapperClass = 
    "group relative flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-gray-200 transition-all duration-300";

  if (!id) {
    return <div className={wrapperClass}>{content}</div>;
  }

  return (
    <Link href={`/shop/product/${id}`} className={wrapperClass}>
      {content}
    </Link>
  );
}