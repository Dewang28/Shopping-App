"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const order_controller_1 = require("./comtrollers/order.controller");
const auth_middleware_1 = require("./middleware/auth.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
(0, db_1.connectDB)();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000",
    "https://shopping-app-beta-five.vercel.app",
    process.env.CLIENT_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        const isPreviewDomain = /^https:\/\/.*\.vercel\.app$/.test(origin) ||
            /^https:\/\/.*\.onrender\.com$/.test(origin);
        if (isExplicitlyAllowed || isPreviewDomain) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/orders", order_routes_1.default);
app.get("/api/admin/orders", auth_middleware_1.auth, auth_middleware_1.admin, order_controller_1.getAllOrders);
app.get("/api/admin/orders/analytics", auth_middleware_1.auth, auth_middleware_1.admin, order_controller_1.getAdminAnalytics);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
