import express from "express"
import cors from "cors"
import { connectDB } from "./config/db"
import productRoutes from "./routes/productRoutes"
import authRoutes from "./routes/auth.routes"
import orderRoutes from "./routes/order.routes"
import cookieParser from "cookie-parser";

connectDB()

const app = express()

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

