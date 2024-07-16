import express from "express";
import {getOrdersByUserId ,getAllOrdersController,updateOrdersStatusByTimeSlot} from "../controllers/orders.controller.js";
import { pagination } from "../middlewares/paginationHandler.js";
import Order from "../models/order.model.js";
import { updateOrderStatusByUser } from '../controllers/orders.controller.js';

const router = express.Router();

// Route to get orders by user ID
router.get("/user/orders", getOrdersByUserIdController);
router.get("/allOrders", getAllOrdersController);
router.get("/users/orders", getOrdersByUserId);
router.get('/allOrders',getAllOrdersController);
router.post('/update-status', updateOrdersStatusByTimeSlot);
router.post('/update-status/:userId', updateOrderStatusByUser);

export default router;
