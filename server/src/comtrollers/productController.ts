import { Request, Response } from "express"
import Product from "../models/Product"

export const createProduct = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" })
  }

  const { title, price, description } = req.body
  const image = req.file.path

  const product = await Product.create({
    title,
    price,
    description,
    image
  })

  res.status(201).json(product)
}

export const getProducts = async (_: Request, res: Response) => {
  const products = await Product.find()
  res.json(products)
}
