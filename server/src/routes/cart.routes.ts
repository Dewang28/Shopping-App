import express from "express";
import { clearCart, getCart, syncCart } from "../comtrollers/cart.controller";
import { auth } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", auth, getCart);
router.put("/", auth, syncCart);
router.delete("/", auth, clearCart);

export default router;
