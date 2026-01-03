"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../comtrollers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.auth, order_controller_1.createOrder);
router.get("/me", auth_middleware_1.auth, order_controller_1.getMyOrders);
exports.default = router;
