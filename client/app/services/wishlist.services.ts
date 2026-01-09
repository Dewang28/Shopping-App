import  api  from "./api"

export const getWishlist = async () => {
  const res = await api.get("/api/wishlist")
  return res.data
}

export const toggleWishlist = async (productId: string) => {
  const res = await api.post("/api/wishlist/toggle", { productId })
  return res.data
}