"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const Cart_1 = __importDefault(require("../models/Cart"));
const createOrder = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user.id;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const requiredAddressFields = ["name", "phone", "line1", "city", "state", "pincode"];
        const hasMissingAddress = requiredAddressFields.some((field) => !address?.[field]?.trim());
        if (hasMissingAddress) {
            return res.status(400).json({ message: "Complete delivery address is required" });
        }
        const normalizedItems = items
            .filter((item) => item?.productId && Number(item?.quantity) > 0)
            .map((item) => ({
            productId: String(item.productId),
            quantity: Number(item.quantity),
        }));
        if (normalizedItems.length === 0) {
            return res.status(400).json({ message: "No valid products in order" });
        }
        const products = await Product_1.default.find({
            _id: { $in: normalizedItems.map((item) => item.productId) },
        }).lean();
        const productMap = new Map(products.map((product) => [String(product._id), product]));
        const orderItems = normalizedItems.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
            }
            return {
                product: item.productId,
                title: product.title,
                image: product.images?.[0],
                quantity: item.quantity,
                price: product.price,
                lineTotal: product.price * item.quantity,
            };
        });
        const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
        const shipping = subtotal > 1000 ? 0 : 99;
        const total = subtotal + shipping;
        const order = await Order_1.default.create({
            user: userId,
            items: orderItems,
            address: {
                name: address.name.trim(),
                phone: address.phone.trim(),
                line1: address.line1.trim(),
                city: address.city.trim(),
                state: address.state.trim(),
                pincode: address.pincode.trim(),
            },
            subtotal,
            shipping,
            total,
            paymentMethod: "cod",
        });
        await Cart_1.default.findOneAndUpdate({ user: userId }, { items: [] });
        res.status(201).json(order);
    }
    catch (error) {
        console.error("CREATE_ORDER_ERROR:", error);
        res.status(500).json({
            message: "Failed to create order",
            error: error.message,
        });
    }
};
exports.createOrder = createOrder;
const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order_1.default.find({ user: userId }).sort({ createdAt: -1 }).lean();
        const productIds = Array.from(new Set(orders.flatMap((order) => (order.items || [])
            .map((item) => item.product || item.productId)
            .filter(Boolean))));
        const products = await Product_1.default.find({ _id: { $in: productIds } }, { title: 1, price: 1, images: 1 }).lean();
        const productMap = new Map(products.map((product) => [String(product._id), product]));
        const enrichedOrders = orders.map((order) => {
            const items = (order.items || []).map((item) => {
                const productId = item.product || item.productId || "";
                const product = productMap.get(String(productId));
                const price = item.price ?? product?.price ?? 0;
                const quantity = item.quantity ?? 1;
                return {
                    product: productId,
                    title: item.title || product?.title || "Product",
                    image: item.image || product?.images?.[0],
                    quantity,
                    price,
                    lineTotal: item.lineTotal ?? price * quantity,
                };
            });
            const subtotal = order.subtotal ?? items.reduce((sum, item) => sum + item.lineTotal, 0);
            const shipping = order.shipping ?? (subtotal > 1000 ? 0 : 99);
            return {
                ...order,
                items,
                subtotal,
                shipping,
                total: order.total ?? subtotal + shipping,
                paymentMethod: order.paymentMethod || "cod",
                status: order.status || "pending",
            };
        });
        res.json(enrichedOrders);
    }
    catch (error) {
        console.error("GET_ORDERS_ERROR:", error);
        res.status(500).json({
            message: "Failed to fetch orders",
            error: error.message,
        });
    }
};
exports.getMyOrders = getMyOrders;
