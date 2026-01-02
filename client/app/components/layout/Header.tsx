"use client";

import Link from "next/link";
import { useAuthStore } from "../../store/auth.store";
import { logout } from "../../services/auth.service";
import { Search, User, Heart, ShoppingBag, LayoutDashboard } from "lucide-react";
import { useCartStore } from "../../store/cart.store";

const categories = [
  { label: "MEN", slug: "men" },
  { label: "WOMEN", slug: "women" },
  { label: "KIDS", slug: "kids" },
  { label: "HOME", slug: "home" },
  { label: "BEAUTY", slug: "beauty" },
  { label: "GENZ", slug: "genz" },
];

export default function Header() {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    await logout();
    useAuthStore.getState().setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-gray-900 hover:opacity-80 transition-opacity shrink-0"
        >
          SHOP.
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex gap-8 items-center">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group flex flex-col items-center gap-1"
            >
              <span className="text-sm font-bold text-gray-700 group-hover:text-black transition-colors uppercase tracking-wide">
                {cat.label}
              </span>
              {/* Hover Underline Effect */}
              <span className="h-[2px] w-0 bg-black group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto">
          <div className="relative w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors pointer-events-none">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full h-11 pl-11 pr-4 text-sm bg-gray-100 text-gray-900 rounded-full border-transparent focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Admin Link */}
          {user?.role === "admin" && (
            <Link
              href="/admin/products/create"
              className="hidden sm:flex flex-col items-center gap-1 group text-gray-600 hover:text-black"
            >
              <LayoutDashboard className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-[11px] font-bold uppercase tracking-wide">Admin</span>
            </Link>
          )}

          {/* Login / Logout */}
          {!user ? (
            <Link
              href="/login"
              className="flex flex-col items-center gap-1 group text-gray-700 hover:text-black transition-colors"
            >
              <User className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-[11px] font-bold uppercase tracking-wide hidden sm:block">Login</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 group text-gray-700 hover:text-black transition-colors"
            >
              <User className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-[11px] font-bold uppercase tracking-wide hidden sm:block">Logout</span>
            </button>
          )}

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="flex flex-col items-center gap-1 group text-gray-700 hover:text-black transition-colors"
          >
            <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-bold uppercase tracking-wide hidden sm:block">Wishlist</span>
          </Link>

          {/* Cart / Bag */}
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 group text-gray-700 hover:text-black transition-colors relative"
          >
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-bold uppercase tracking-wide hidden sm:block">Bag</span>
            
            {/* Cart Counter Badge */}
            {count > 0 && (
              <span className="absolute -top-1 right-[-4px] sm:right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}