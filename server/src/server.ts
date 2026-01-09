import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import cookieParser from "cookie-parser";
import wishlistRoutes from "./routes/wishlist.routes";
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "https://shopping-app-beta-five.vercel.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});