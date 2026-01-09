import { Request, Response } from "express"
import Wishlist from "../models/Wishlist"

interface AuthRequest extends Request {
  user?: any
}

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products")

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] })
    }

    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist" })
  }
}

export const toggleWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id
    const { productId } = req.body

    let wishlist = await Wishlist.findOne({ user: userId })

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [productId] })
      return res.status(200).json({ message: "Added to wishlist", wishlist })
    }

    const index = wishlist.products.indexOf(productId)

    if (index === -1) {
      wishlist.products.push(productId)
      await wishlist.save()
      return res.status(200).json({ message: "Added to wishlist", wishlist })
    } else {
      wishlist.products.splice(index, 1)
      await wishlist.save()
      return res.status(200).json({ message: "Removed from wishlist", wishlist })
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating wishlist" })
  }
}