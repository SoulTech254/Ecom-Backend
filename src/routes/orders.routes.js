import express from "express";
import {
  getAllOrdersController,
  getOrderController,
  getOrdersByUserIdController,
  updateOrderStatusByUser,
  updateOrderLogisticsController
} from "../controllers/orders.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = express.Router();

// Route to get orders by user ID
router.get("/user/orders", verifyJWT,  getOrdersByUserIdController);
router.get("/", getAllOrdersController);
router.get("/:orderId", getOrderController);
router.put("/update-status/:orderId", updateOrderStatusByUser);
router.put("/update-logistics/:orderId", updateOrderLogisticsController);

export default router;
