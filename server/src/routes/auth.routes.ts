import { Router } from "express";
import { login, register, logout, me } from "../comtrollers/auth.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);   
router.post("/logout", logout);
router.get("/me", auth, me);

export default router;
