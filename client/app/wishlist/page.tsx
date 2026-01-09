"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Container from "../components/layout/Container"
import ProductCard from "../components/product/ProductCard"
import { getWishlist } from "../services/wishlist.services"

interface BackendProduct {
  _id: string
  name: string
  price: number
  category: string
  images: string[]
  brand?: string
  mrp?: number
  discount?: number
}

interface WishlistResponse {
  _id: string
  products: BackendProduct[]
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist()
      setWishlist(data)
    } catch (error) {
      console.error("Error loading wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        </div>
      </Container>
    )
  }

  const products = wishlist?.products || []

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-100 bg-gray-50/50 py-16">
        <Container>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Your Wishlist
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            {products.length} {products.length === 1 ? "item" : "items"} saved for later
          </p>
        </Container>
      </div>
      <div className="py-12">
        <Container>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your wishlist is empty
              </h2>
              <p className="mt-2 max-w-sm text-gray-500">
                Looks like you havent added anything to your wishlist yet.
              </p>
              <Link
                href="/shop"
                className="mt-8 rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-105 hover:bg-gray-800"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
              {products.map((item) => (
                <ProductCard
                  key={item._id}
                  id={item._id}
                  title={item.name}
                  price={item.price}
                  image={item.images?.[0] || ""}
                  brand={item.brand || item.category || "Generic"}
                  mrp={item.mrp}
                  discount={item.discount}
                />
              ))}
            </div>
          )}
        </Container>
      </div>
    </div>
  )
}