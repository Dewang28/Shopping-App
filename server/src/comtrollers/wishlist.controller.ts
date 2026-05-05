import { Request, Response } from "express"
import { Types } from "mongoose"
import Wishlist from "../models/Wishlist"

interface AuthRequest extends Request {
  user?: any
}

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(401).json({ message: "INVALID_USER" })
    }

    let wishlist = await Wishlist.findOne({ user: userId }).populate("products")

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] })
    }

    res.json(wishlist)
  } catch (error: any) {
    console.error("GET_WISHLIST_ERROR:", error)
    res.status(500).json({ message: "Error fetching wishlist", error: error.message })
  }
}

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id
    const { productId } = req.body
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid wishlist request" })
    }

    let wishlist = await Wishlist.findOne({ user: userId })

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId] })
      return res.status(200).json({ message: "Added to wishlist", wishlist })
    }

    const index = wishlist.products.findIndex((product) => String(product) === String(productId))

    if (index === -1) {
      wishlist.products.push(new Types.ObjectId(productId))
      await wishlist.save()
      return res.status(200).json({ message: "Added to wishlist", wishlist })
    } else {
      wishlist.products.splice(index, 1)
      await wishlist.save()
      return res.status(200).json({ message: "Removed from wishlist", wishlist })
    }
  } catch (error: any) {
    console.error("TOGGLE_WISHLIST_ERROR:", error)
    res.status(500).json({ message: "Error updating wishlist", error: error.message })
  }
}
