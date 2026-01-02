import { Router } from "express";
import { createProduct, getProducts , getProductById } from "../comtrollers/productController";
import { upload } from "../utils/upload";
import { auth, admin } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  upload.array("images"), 
  auth,
  admin,
  createProduct
);

router.get("/", getProducts);
router.get("/:id", getProductById);


export default router;
