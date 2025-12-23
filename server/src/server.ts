import express from "express"
import cors from "cors"
import { connectDB } from "./config/db"
import productRoutes from "./routes/productRoutes"
import authRoutes from "./routes/auth.routes"
import orderRoutes from "./routes/order.routes"


connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

app.listen(process.env.PORT)
console.log(`Server running on port ${process.env.PORT}`)
