import express from "express";
import {
  getAllOrdersController,
  getOrdersByUserIdController,
} from "../controllers/orders.controller.js";


const router = express.Router();

// Route to get orders by user ID
router.get("/user/orders", getOrdersByUserIdController);
router.get("/allOrders", getAllOrdersController);

export default router;
