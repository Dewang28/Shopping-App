import { Request, Response } from "express";
import Product from "../models/Product";

const toOptionalNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseBoolean = (value: unknown, fallback = true) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
};

const parseCategories = (category: unknown) => {
  if (Array.isArray(category)) {
    return category.map(String);
  }

  if (typeof category === "string") {
    try {
      const parsed = JSON.parse(category);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return category ? [category] : [];
    }
  }

  return [];
};

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
      sku,
      price,
      mrp,
      discount,
      description,
      category,
      gender,
      stock,
      lowStockThreshold,
      isActive,
    } = req.body;

    if (!title || !brand || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedCategory = parseCategories(category);

    if (!Array.isArray(parsedCategory) || parsedCategory.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one category is required" });
    }

    const product = await Product.create({
      title,
      brand,
      sku: sku || undefined,
      price: Number(price),
      mrp: toOptionalNumber(mrp),
      discount: toOptionalNumber(discount),
      description,
      images: imageUrls,
      category: parsedCategory,
      gender: Boolean(gender) ? gender : undefined,
      stock: toOptionalNumber(stock) ?? 0,
      lowStockThreshold: toOptionalNumber(lowStockThreshold) ?? 5,
      isActive: parseBoolean(isActive, true),
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
    const { category, brand, gender, sort, search, minPrice, maxPrice, includeInactive } = req.query;

    let query: any = {};

    if (includeInactive !== "true") {
      query.isActive = { $ne: false };
    }

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
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const parsedMinPrice = toOptionalNumber(minPrice);
    const parsedMaxPrice = toOptionalNumber(maxPrice);

    if (parsedMinPrice !== undefined || parsedMaxPrice !== undefined) {
      query.price = {};
      if (parsedMinPrice !== undefined) query.price.$gte = parsedMinPrice;
      if (parsedMaxPrice !== undefined) query.price.$lte = parsedMaxPrice;
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

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const imageUrls = files?.map((file) => file.path).filter(Boolean) ?? [];
    const parsedCategory = parseCategories(req.body.category);

    const update: any = {
      title: req.body.title,
      brand: req.body.brand,
      sku: req.body.sku || undefined,
      price: toOptionalNumber(req.body.price),
      mrp: toOptionalNumber(req.body.mrp),
      discount: toOptionalNumber(req.body.discount),
      description: req.body.description,
      gender: req.body.gender || undefined,
      stock: toOptionalNumber(req.body.stock),
      lowStockThreshold: toOptionalNumber(req.body.lowStockThreshold),
      isActive: req.body.isActive === undefined ? undefined : parseBoolean(req.body.isActive, true),
    };

    if (parsedCategory.length > 0) {
      update.category = parsedCategory;
    }

    if (imageUrls.length > 0) {
      update.images = imageUrls;
    }

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err: any) {
    console.error("UPDATE_PRODUCT_ERROR:", err);
    res.status(500).json({ message: "Failed to update product", error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deactivated", product });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to delete product", error: err.message });
  }
};
