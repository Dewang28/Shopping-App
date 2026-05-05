import { Router } from "express"
import {
  createOrder,
  getAdminAnalytics,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../comtrollers/order.controller"
import { admin, auth } from "../middleware/auth.middleware"

const router = Router()

router.post("/", auth, createOrder)
router.get("/me", auth, getMyOrders)
router.get("/admin/analytics", auth, admin, getAdminAnalytics)
router.get("/admin", auth, admin, getAllOrders)
router.patch("/:id/status", auth, admin, updateOrderStatus)

export default router
