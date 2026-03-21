"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.syncCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
const populateCart = async (userId) => {
    let cart = await Cart_1.default.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        cart = await Cart_1.default.create({ user: userId, items: [] });
        cart = await cart.populate("items.product");
    }
    return cart;
};
const getCart = async (req, res) => {
    try {
        const cart = await populateCart(req.user.id);
        res.json(cart);
    }
    catch (error) {
        console.error("GET_CART_ERROR:", error);
        res.status(500).json({ message: "Error fetching cart" });
    }
};
exports.getCart = getCart;
const syncCart = async (req, res) => {
    try {
        const rawItems = Array.isArray(req.body?.items)
            ? req.body.items
            : [];
        const normalizedItems = rawItems
            .filter((item) => item?.productId && Number(item?.quantity) > 0)
            .map((item) => ({
            productId: String(item.productId),
            quantity: Number(item.quantity),
        }));
        const productIds = normalizedItems.map((item) => item.productId);
        const existingProducts = await Product_1.default.find({ _id: { $in: productIds } }, { _id: 1 }).lean();
        const validIds = new Set(existingProducts.map((product) => String(product._id)));
        const items = normalizedItems
            .filter((item) => validIds.has(item.productId))
            .map((item) => ({
            product: item.productId,
            quantity: item.quantity,
        }));
        const cart = await Cart_1.default.findOneAndUpdate({ user: req.user.id }, { user: req.user.id, items }, { new: true, upsert: true, setDefaultsOnInsert: true }).populate("items.product");
        res.json(cart);
    }
    catch (error) {
        console.error("SYNC_CART_ERROR:", error);
        res.status(500).json({ message: "Error syncing cart" });
    }
};
exports.syncCart = syncCart;
const clearCart = async (req, res) => {
    try {
        const cart = await Cart_1.default.findOneAndUpdate({ user: req.user.id }, { user: req.user.id, items: [] }, { new: true, upsert: true, setDefaultsOnInsert: true }).populate("items.product");
        res.json(cart);
    }
    catch (error) {
        console.error("CLEAR_CART_ERROR:", error);
        res.status(500).json({ message: "Error clearing cart" });
    }
};
exports.clearCart = clearCart;
