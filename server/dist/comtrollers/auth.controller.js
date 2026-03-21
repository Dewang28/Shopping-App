"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.me = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            email,
            password: hashed,
        });
        res.status(201).json(user);
    }
    catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({
            message: "Registration failed",
            error: err.message,
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "USER_NOT_FOUND" });
    }
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: "PASSWORD_MISMATCH" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
        token,
        user: {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};
exports.login = login;
const me = async (req, res) => {
    const authReq = req;
    const user = await User_1.default.findById(authReq.user?.id);
    if (!user) {
        return res.status(404).json({ message: "USER_NOT_FOUND" });
    }
    res.json({
        user: {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};
exports.me = me;
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged out" });
};
exports.logout = logout;
