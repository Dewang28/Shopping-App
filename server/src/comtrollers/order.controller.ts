import { Request, Response } from "express"
import Order from "../models/Order"
import Product from "../models/Product"
import Cart from "../models/Cart"

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, address } = req.body
    const userId = (req as any).user.id

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const requiredAddressFields = ["name", "phone", "line1", "city", "state", "pincode"] as const
    const hasMissingAddress = requiredAddressFields.some(
      (field) => !address?.[field]?.trim()
    )

    if (hasMissingAddress) {
      return res.status(400).json({ message: "Complete delivery address is required" })
    }

    const normalizedItems = items
      .filter((item: { productId?: string; quantity?: number }) => item?.productId && Number(item?.quantity) > 0)
      .map((item: { productId: string; quantity: number }) => ({
        productId: String(item.productId),
        quantity: Number(item.quantity),
      }))

    if (normalizedItems.length === 0) {
      return res.status(400).json({ message: "No valid products in order" })
    }

    const products = await Product.find({
      _id: { $in: normalizedItems.map((item) => item.productId) },
    }).lean()

    const productMap = new Map(products.map((product) => [String(product._id), product]))

    const orderItems = normalizedItems.map((item) => {
      const product = productMap.get(item.productId)

      if (!product) {
        throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`)
      }

      return {
        product: item.productId,
        title: product.title,
        image: product.images?.[0],
        quantity: item.quantity,
        price: product.price,
        lineTotal: product.price * item.quantity,
      }
    })

    const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const shipping = subtotal > 1000 ? 0 : 99
    const total = subtotal + shipping

    const order = await Order.create({
      user: userId,
      items: orderItems,
      address: {
        name: address.name.trim(),
        phone: address.phone.trim(),
        line1: address.line1.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim(),
      },
      subtotal,
      shipping,
      total,
      paymentMethod: "cod",
    })

    await Cart.findOneAndUpdate({ user: userId }, { items: [] })

    res.status(201).json(order)
  } catch (error: any) {
    console.error("CREATE_ORDER_ERROR:", error)
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    })
  }
}

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error: any) {
    console.error("GET_ORDERS_ERROR:", error)
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    })
  }
}
