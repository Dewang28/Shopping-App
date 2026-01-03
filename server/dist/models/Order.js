"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: { type: String, required: true },
    items: [
        {
            product: String,
            quantity: Number,
            price: Number
        }
    ],
    total: Number,
    status: { type: String, default: "pending" }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
