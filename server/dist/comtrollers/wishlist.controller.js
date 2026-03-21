"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleWishlist = exports.getWishlist = void 0;
const Wishlist_1 = __importDefault(require("../models/Wishlist"));
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        let wishlist = await Wishlist_1.default.findOne({ user: userId }).populate("products");
        if (!wishlist) {
            wishlist = await Wishlist_1.default.create({ user: userId, products: [] });
        }
        res.json(wishlist);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching wishlist" });
    }
};
exports.getWishlist = getWishlist;
const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        let wishlist = await Wishlist_1.default.findOne({ user: userId });
        if (!wishlist) {
            wishlist = await Wishlist_1.default.create({ user: userId, products: [productId] });
            return res.status(200).json({ message: "Added to wishlist", wishlist });
        }
        const index = wishlist.products.indexOf(productId);
        if (index === -1) {
            wishlist.products.push(productId);
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
        res.status(500).json({ message: "Error updating wishlist" });
    }
};
exports.toggleWishlist = toggleWishlist;
