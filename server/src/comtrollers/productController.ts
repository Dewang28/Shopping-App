import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrls = files.map((file) => file.path).filter(Boolean);

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const {
      title,
      brand,
      price,
      mrp,
      discount,
      description,
    } = req.body;

    if (!title || !brand || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      title,
      brand,
      price: Number(price),
      mrp: mrp ? Number(mrp) : undefined,
      discount: discount ? Number(discount) : undefined,
      description,
      images: imageUrls,
    });

    res.status(201).json(product);
  } catch (err: any) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find().lean();

  const normalized = products.map((p: any) => ({
    ...p,
    images:
      Array.isArray(p.images) && p.images.length
        ? p.images
        : p.image
        ? [p.image]
        : [],
  }));

  res.json(normalized);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};
