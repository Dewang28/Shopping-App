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
      <div className="relative w-full aspect-[4/5] bg-muted overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-textSecondary">
            Image unavailable
          </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
          {brand}
        </h3>
        <p className="text-sm line-clamp-2">{title}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">₹{price}</span>
          {mrp && (
            <span className="line-through text-textSecondary">
              ₹{mrp}
            </span>
          )}
          {discount && (
            <span className="text-primary font-medium">
              ({discount}% OFF)
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (!id) {
    return <div className="group">{content}</div>;
  }

  return (
    <Link href={`/shop/product/${id}`} className="group cursor-pointer">
      {content}
    </Link>
  );
}
