"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;
        const token = bearerToken || req.cookies?.token;
        if (!token)
            return res.status(401).json({ message: "UNAUTHORIZED" });
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "INVALID_OR_EXPIRED_TOKEN" });
    }
};
exports.auth = auth;
const admin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).end();
    }
    next();
};
exports.admin = admin;
