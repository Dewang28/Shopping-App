import { Request, Response } from "express"
import { Types } from "mongoose"
import Order from "../models/Order"
import Product from "../models/Product"
import Cart from "../models/Cart"

const ORDER_STATUSES = ["placed", "delivered", "returned"] as const
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const
const normalizeOrderStatus = (status?: string) =>
  status === "delivered" || status === "returned" ? status : "placed"

type LegacyOrderItem = {
  product?: string
  productId?: string
  title?: string
  image?: string
  quantity?: number
  price?: number
  lineTotal?: number
}

const getStockUpdates = (
  items: { product?: string; quantity?: number }[],
  direction: "reserve" | "restore"
) =>
  items
    .filter((item) => item.product && Types.ObjectId.isValid(item.product) && Number(item.quantity) > 0)
    .map((item) => ({
      updateOne: {
        filter:
          direction === "reserve"
            ? { _id: new Types.ObjectId(item.product!), stock: { $gte: Number(item.quantity) } }
            : { _id: new Types.ObjectId(item.product!) },
        update: {
          $inc: {
            stock: direction === "reserve" ? -Number(item.quantity) : Number(item.quantity),
          },
        },
      },
    }))

const enrichOrders = async (orders: any[]) => {
  const productIds = Array.from(
    new Set(
      orders.flatMap((order: any) =>
        (order.items || [])
          .map((item: LegacyOrderItem) => item.product || item.productId)
          .filter((productId: string) => productId && Types.ObjectId.isValid(productId))
      )
    )
  ) as string[]

  const products = await Product.find(
    { _id: { $in: productIds } },
    { title: 1, price: 1, images: 1 }
  ).lean()

  const productMap = new Map(products.map((product) => [String(product._id), product]))

  return orders.map((order: any) => {
    const items = (order.items || []).map((item: LegacyOrderItem) => {
      const productId = item.product || item.productId || ""
      const product = productMap.get(String(productId))
      const price = item.price ?? product?.price ?? 0
      const quantity = item.quantity ?? 1

      return {
        product: productId,
        title: item.title || product?.title || "Product",
        image: item.image || product?.images?.[0],
        quantity,
        price,
        lineTotal: item.lineTotal ?? price * quantity,
      }
    })

    const subtotal = order.subtotal ?? items.reduce(
      (sum: number, item: { lineTotal: number }) => sum + item.lineTotal,
      0
    )
    const shipping = order.shipping ?? (subtotal > 1000 ? 0 : 99)

    return {
      ...order,
      items,
      subtotal,
      shipping,
      total: order.total ?? subtotal + shipping,
      paymentMethod: order.paymentMethod || "cod",
      paymentStatus: order.paymentStatus || "pending",
      status: normalizeOrderStatus(order.status),
      tracking: order.tracking,
      statusHistory: order.statusHistory?.length
        ? order.statusHistory
        : [{ status: normalizeOrderStatus(order.status), updatedAt: order.createdAt }],
    }
  })
}

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

      if ((product.stock ?? 0) < item.quantity) {
        throw new Error(`INSUFFICIENT_STOCK:${product.title}`)
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

    const stockUpdate = await Product.bulkWrite(getStockUpdates(orderItems, "reserve"))

    if (stockUpdate.modifiedCount !== orderItems.length) {
      return res.status(400).json({ message: "One or more products just went out of stock" })
    }

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
      paymentStatus: "pending",
      status: "placed",
      statusHistory: [{ status: "placed", note: "Order placed" }],
    })

    await Cart.findOneAndUpdate({ user: userId }, { items: [] })

    res.status(201).json(order)
  } catch (error: any) {
    console.error("CREATE_ORDER_ERROR:", error)
    if (error.message?.startsWith("INSUFFICIENT_STOCK:")) {
      return res.status(400).json({
        message: `${error.message.split(":")[1]} does not have enough stock`,
      })
    }

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    })
  }
}

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean()
    const enrichedOrders = await enrichOrders(orders)

    res.json(enrichedOrders)
  } catch (error: any) {
    console.error("GET_ORDERS_ERROR:", error)
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    })
  }
}

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean()
    res.json(await enrichOrders(orders))
  } catch (error: any) {
    console.error("GET_ADMIN_ORDERS_ERROR:", error)
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const {
      status,
      paymentStatus,
      note,
      courier,
      trackingNumber,
      estimatedDelivery,
    } = req.body

    if (status && !ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" })
    }

    if (paymentStatus && !PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    if (status === "returned" && order.status !== "returned" && !order.returnedStockRestored) {
      const stockUpdates = getStockUpdates(order.items, "restore")

      if (stockUpdates.length > 0) {
        await Product.bulkWrite(stockUpdates)
      }

      order.returnedStockRestored = true
      order.returnedStockRestoredAt = new Date()
    }

    if (order.status === "returned" && status && status !== "returned" && order.returnedStockRestored) {
      const stockUpdates = getStockUpdates(order.items, "reserve")
      const stockUpdate = stockUpdates.length > 0 ? await Product.bulkWrite(stockUpdates) : null

      if (stockUpdate && stockUpdate.modifiedCount !== stockUpdates.length) {
        return res.status(400).json({ message: "Not enough stock to move returned order back" })
      }

      order.returnedStockRestored = false
      order.returnedStockRestoredAt = undefined
    }

    if (status) {
      order.status = status
      order.statusHistory.push({
        status,
        note: note?.trim() || undefined,
        updatedAt: new Date(),
      })
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus
    }

    if (courier || trackingNumber || estimatedDelivery) {
      order.tracking = {
        ...(order.tracking ? JSON.parse(JSON.stringify(order.tracking)) : {}),
        ...(courier ? { courier } : {}),
        ...(trackingNumber ? { trackingNumber } : {}),
        ...(estimatedDelivery ? { estimatedDelivery: new Date(estimatedDelivery) } : {}),
      }
    }

    await order.save()
    const [enrichedOrder] = await enrichOrders([order.toObject()])

    res.json(enrichedOrder)
  } catch (error: any) {
    console.error("UPDATE_ORDER_STATUS_ERROR:", error)
    res.status(500).json({
      message: "Failed to update order",
      error: error.message,
    })
  }
}

export const getAdminAnalytics = async (_req: Request, res: Response) => {
  try {
    const [orderStats] = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          revenue: { $sum: "$total" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "placed"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
    ])

    const lowStockProducts = await Product.aggregate([
      {
        $addFields: {
          normalizedStock: { $ifNull: ["$stock", 0] },
          normalizedLowStockThreshold: { $ifNull: ["$lowStockThreshold", 5] },
        },
      },
      {
        $match: {
          isActive: { $ne: false },
          $expr: { $lt: ["$normalizedStock", "$normalizedLowStockThreshold"] },
        },
      },
      { $sort: { normalizedStock: 1 } },
      { $limit: 6 },
      {
        $project: {
          title: 1,
          brand: 1,
          stock: "$normalizedStock",
          lowStockThreshold: "$normalizedLowStockThreshold",
        },
      },
    ])

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          title: { $first: "$items.title" },
          quantitySold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.lineTotal" },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 },
    ])

    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ])

    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    const inventoryStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          productCount: {
            $sum: { $cond: [{ $ne: ["$isActive", false] }, 1, 0] },
          },
          inactiveProducts: {
            $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
          },
          totalStock: { $sum: "$stock" },
          outOfStockProducts: {
            $sum: { $cond: [{ $lte: ["$stock", 0] }, 1, 0] },
          },
        },
      },
    ])

    const inventory = inventoryStats[0] ?? {
      productCount: 0,
      inactiveProducts: 0,
      totalStock: 0,
      outOfStockProducts: 0,
    }

    res.json({
      totalOrders: orderStats?.totalOrders ?? 0,
      revenue: orderStats?.revenue ?? 0,
      pendingOrders: orderStats?.pendingOrders ?? 0,
      deliveredOrders: orderStats?.deliveredOrders ?? 0,
      productCount: inventory.productCount,
      inactiveProducts: inventory.inactiveProducts,
      totalStock: inventory.totalStock,
      outOfStockProducts: inventory.outOfStockProducts,
      lowStockProducts,
      topProducts,
      monthlySales: monthlySales.reverse().map((item) => ({
        label: `${item._id.month}/${item._id.year}`,
        revenue: item.revenue,
        orders: item.orders,
      })),
      orderStatusBreakdown: orderStatusBreakdown.map((item) => ({
        status: normalizeOrderStatus(item._id),
        count: item.count,
      })),
    })
  } catch (error: any) {
    console.error("GET_ADMIN_ANALYTICS_ERROR:", error)
    res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    })
  }
}
