"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const createOrder = async (req, res) => {
    const { items, total } = req.body;
    const userId = req.user.id;
    const order = await Order_1.default.create({
        user: userId,
        items,
        total
    });
    res.status(201).json(order);
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    const orders = await Order_1.default.find({ user: userId });
    res.json(orders);
};
exports.getMyOrders = getMyOrders;
