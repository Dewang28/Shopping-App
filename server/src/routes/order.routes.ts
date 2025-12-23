import { Router } from "express"
import { createOrder, getMyOrders } from "../comtrollers/order.controller"
import { auth } from "../middleware/auth.middleware"

const router = Router()

router.post("/", auth, createOrder)
router.get("/me", auth, getMyOrders)

export default router
