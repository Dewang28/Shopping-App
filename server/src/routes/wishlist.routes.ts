import express from "express"
import { getWishlist, toggleWishlist } from "../comtrollers/wishlist.controller"
import { auth } from "../middleware/auth.middleware"

const router = express.Router()

router.get("/", auth, getWishlist)
router.post("/toggle", auth, toggleWishlist)

export default router