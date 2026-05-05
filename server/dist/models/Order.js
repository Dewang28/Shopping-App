"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: { type: String, required: true },
    items: [
        {
            product: { type: String, required: true },
            title: { type: String, required: true },
            image: { type: String },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            lineTotal: { type: Number, required: true },
        }
    ],
    address: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        line1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "cod" },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, enum: ["placed", "delivered", "returned"], default: "placed" },
    returnedStockRestored: { type: Boolean, default: false },
    returnedStockRestoredAt: { type: Date },
    tracking: {
        courier: { type: String },
        trackingNumber: { type: String },
        estimatedDelivery: { type: Date },
    },
    statusHistory: [
        {
            status: { type: String, enum: ["placed", "delivered", "returned"], required: true },
            note: { type: String },
            updatedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
