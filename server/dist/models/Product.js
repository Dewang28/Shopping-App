"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
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
}, {
    timestamps: true,
    strict: true,
});
exports.default = (0, mongoose_1.model)("Product", productSchema);
