"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlist = exports.getWishlist = void 0;
const mongoose_1 = require("mongoose");
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: "INVALID_USER" });
        }
        let wishlist = await Wishlist_1.default.findOne({ user: userId }).populate("products");
        if (!wishlist) {
            wishlist = await Wishlist_1.default.create({ user: userId, products: [] });
        }
        res.json(wishlist);
    }
    catch (error) {
        console.error("GET_WISHLIST_ERROR:", error);
        res.status(500).json({ message: "Error fetching wishlist", error: error.message });
    }
};
exports.getWishlist = getWishlist;
const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(userId) || !mongoose_1.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid wishlist request" });
        }
        let wishlist = await Wishlist_1.default.findOne({ user: userId });
        if (!wishlist) {
            wishlist = await Wishlist_1.default.create({ user: userId, products: [productId] });
            return res.status(200).json({ message: "Added to wishlist", wishlist });
        }
        const index = wishlist.products.findIndex((product) => String(product) === String(productId));
        if (index === -1) {
            wishlist.products.push(new mongoose_1.Types.ObjectId(productId));
            await wishlist.save();
            return res.status(200).json({ message: "Added to wishlist", wishlist });
        }
        else {
            wishlist.products.splice(index, 1);
            await wishlist.save();
            return res.status(200).json({ message: "Removed from wishlist", wishlist });
        }
    }
    catch (error) {
        console.error("TOGGLE_WISHLIST_ERROR:", error);
        res.status(500).json({ message: "Error updating wishlist", error: error.message });
    }
};
exports.toggleWishlist = toggleWishlist;
