import { Router } from "express";
import { login, register, logout } from "../comtrollers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);   // ✅ MUST EXIST
router.post("/logout", logout);

export default router;
