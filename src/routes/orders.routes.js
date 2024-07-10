import express from "express";
import {getOrdersByUserId ,getAllOrdersController} from "../controllers/orders.controller.js";
import { pagination } from "../middlewares/paginationHandler.js";
import Order from "../models/order.model.js";

const router = express.Router();

// Route to get orders by user ID
router.get("/users/orders", getOrdersByUserId);
router.get('/allOrders',getAllOrdersController);

export default router;
