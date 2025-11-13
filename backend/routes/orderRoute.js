import express from "express";
import { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// Order creation and user-specific endpoints
orderRouter.post("/create", authMiddleware, createOrder);
orderRouter.get("/user-orders", authMiddleware, getUserOrders);

// Admin / public endpoints used by admin panel (register before param route)
orderRouter.get("/all", getAllOrders);
orderRouter.put("/update-status/:id", updateOrderStatus);

// Get by id (kept last so '/all' doesn't get treated as an id)
orderRouter.get("/:id", authMiddleware, getOrderById);

export default orderRouter;