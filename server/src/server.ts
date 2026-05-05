import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import {
  getAdminAnalytics,
  getAllOrders,
} from "./comtrollers/order.controller";
import { admin, auth } from "./middleware/auth.middleware";
import cookieParser from "cookie-parser";
import wishlistRoutes from "./routes/wishlist.routes";
import cartRoutes from "./routes/cart.routes";
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://shopping-app-beta-five.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isExplicitlyAllowed = allowedOrigins.includes(origin);
      const isPreviewDomain =
        /^https:\/\/.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.onrender\.com$/.test(origin);

      if (isExplicitlyAllowed || isPreviewDomain) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/admin/orders", auth, admin, getAllOrders);
app.get("/api/admin/orders/analytics", auth, admin, getAdminAnalytics);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
