import { Request, Response } from "express";
import Cart from "../models/Cart";
import Product from "../models/Product";

interface AuthRequest extends Request {
  user?: { id: string };
}

interface IncomingCartItem {
  productId?: string;
  quantity?: number;
}

const populateCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await cart.populate("items.product");
  }

  return cart;
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await populateCart(req.user!.id);
    res.json(cart);
  } catch (error) {
    console.error("GET_CART_ERROR:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const syncCart = async (req: AuthRequest, res: Response) => {
  try {
    const rawItems: IncomingCartItem[] = Array.isArray(req.body?.items)
      ? req.body.items
      : [];
    const normalizedItems = rawItems
      .filter(
        (item: IncomingCartItem) =>
          item?.productId && Number(item?.quantity) > 0
      )
      .map((item) => ({
        productId: String(item.productId),
        quantity: Number(item.quantity),
      }));

    const productIds = normalizedItems.map((item) => item.productId);
    const existingProducts = await Product.find(
      { _id: { $in: productIds } },
      { _id: 1 }
    ).lean();
    const validIds = new Set(existingProducts.map((product) => String(product._id)));

    const items = normalizedItems
      .filter((item: { productId: string; quantity: number }) =>
        validIds.has(item.productId)
      )
      .map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      }));

    const cart = await Cart.findOneAndUpdate(
      { user: req.user!.id },
      { user: req.user!.id, items },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("SYNC_CART_ERROR:", error);
    res.status(500).json({ message: "Error syncing cart" });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user!.id },
      { user: req.user!.id, items: [] },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("items.product");

    res.json(cart);
  } catch (error) {
    console.error("CLEAR_CART_ERROR:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
