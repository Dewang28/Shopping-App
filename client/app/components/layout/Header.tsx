"use client";

import Link from "next/link";
import { useAuthStore } from "../../store/auth.store";
import { logout } from "../../services/auth.service";
import { Search, User, Heart, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/cart.store";

const categories = [
  { label: "MEN", slug: "men" },
  { label: "WOMEN", slug: "women" },
  { label: "KIDS", slug: "kids" },
  { label: "HOME", slug: "home" },
  { label: "BEAUTY", slug: "beauty" },
  { label: "GENZ", slug: "genz" },
  { label: "STUDIO", slug: "studio" },
];

export default function Header() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-primary">
          Shop
        </Link>

        <nav className="hidden lg:flex gap-6 text-sm font-medium">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="hover:text-primary"
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textSecondary" />
            <input className="w-full h-10 pl-10 pr-4 text-sm bg-muted rounded focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          {!user && (
            <Link
              href="/login"
              className="flex flex-col items-center hover:text-primary"
            >
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          )}

          {user && (
            <div
              onClick={async () => {
                await logout();
                useAuthStore.getState().setUser(null);
              }}
              className="flex flex-col items-center cursor-pointer hover:text-primary"
            >
              <User className="h-5 w-5" />
              <span>Logout</span>
            </div>
          )}

          <Link
            href="/wishlist"
            className="flex flex-col items-center hover:text-primary"
          >
            <Heart className="h-5 w-5" />
            <span>Wishlist</span>
          </Link>

          <Link href="/cart" className="relative flex flex-col items-center">
            <ShoppingBag className="h-5 w-5" />
            <span>Bag</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
