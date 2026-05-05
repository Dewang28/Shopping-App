"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    price: { type: Number, required: true },
    mrp: { type: Number },
    discount: { type: Number },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: [String],
        enum: ["men", "women", "kids", "home", "beauty", "genz", "studio"],
        required: true,
    },
    gender: { type: String },
    images: {
        type: [String],
        required: true,
    },
    stock: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    strict: true,
});
productSchema.index({ title: "text", brand: "text", description: "text" });
productSchema.index({ category: 1, brand: 1, gender: 1, price: 1 });
productSchema.index({ stock: 1, isActive: 1 });
exports.default = (0, mongoose_1.model)("Product", productSchema);
