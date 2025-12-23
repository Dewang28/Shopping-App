import { Request, Response } from "express"
import Order from "../models/Order"

export const createOrder = async (req: Request, res: Response) => {
  const { items, total } = req.body
  const userId = (req as any).user.id

  const order = await Order.create({
    user: userId,
    items,
    total
  })

  res.status(201).json(order)
}

export const getMyOrders = async (req: Request, res: Response) => {
  const userId = (req as any).user.id
  const orders = await Order.find({ user: userId })
  res.json(orders)
}
