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
      category,
      gender,
    } = req.body;

    if (!title || !brand || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let parsedCategory: string[] = [];

    if (category) {
      if (Array.isArray(category)) {
        parsedCategory = category;
      } else if (typeof category === "string") {
        try {
          parsedCategory = JSON.parse(category);
        } catch {
          return res
            .status(400)
            .json({ message: "Invalid categories format" });
        }
      }
    }

    if (!Array.isArray(parsedCategory) || parsedCategory.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one category is required" });
    }

    const product = await Product.create({
      title,
      brand,
      price: Number(price),
      mrp: mrp ? Number(mrp) : undefined,
      discount: discount ? Number(discount) : undefined,
      description,
      images: imageUrls,
      category: parsedCategory,
      gender: Boolean(gender) ? gender : undefined,
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
  try {
    const { category, brand, gender, sort, search } = req.query;

    let query: any = {};

    if (category) {
      query.category = { $in: Array.isArray(category) ? category : [category] };
    }

    if (brand) {
      query.brand = { $in: Array.isArray(brand) ? brand : [brand] };
    }

    if (gender) {
      query.gender = { $in: Array.isArray(gender) ? gender : [gender] };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    let sortStage: any = {};
    if (sort === "price_asc") {
      sortStage.price = 1;
    } else if (sort === "price_desc") {
      sortStage.price = -1;
    } else if (sort === "newest") {
      sortStage.createdAt = -1;
    } else {
      sortStage.createdAt = -1;
    }

    const products = await Product.find(query).sort(sortStage);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
};