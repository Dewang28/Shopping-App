import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductById,
  updateProduct,
} from "../comtrollers/productController";
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
router.put("/:id", upload.array("images"), auth, admin, updateProduct);
router.delete("/:id", auth, admin, deleteProduct);


export default router;
