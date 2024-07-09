import express from "express";
import { getOrdersByUserIdController,getAllOrdersController } from "../controllers/orders.controller.js";

const router = express.Router();

// Route to get orders by user ID
router.get("/users/orders", getOrdersByUserIdController);
router.get('/allOrders', getAllOrdersController);

export default router;
