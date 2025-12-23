import { Router } from "express"
import { createProduct, getProducts } from "../comtrollers/productController"
import { upload } from "../utils/upload"
import { auth, admin } from "../middleware/auth.middleware"

const router = Router()

router.post(
  "/",
  auth,
  admin,
  upload.single("image"),
  createProduct
)

router.get("/", getProducts)

export default router
