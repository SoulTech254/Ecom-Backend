import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { findOrders, getAllOrders } from "../services/orders.services.js";

export const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    next(error);
  }
};
export const getOrdersByUserIdController = async (req, res, next) => {
  try {
    console.log("Request received for orders");

    const userId = req.query.userId;
    const status = req.query.status;
    console.log("Extracted userId from request:", userId);

    if (!userId) {
      throw Error("UserId not found!");
    }
    // Check if userId parameter exists in the query string
    console.log("Searching orders for userId:", userId);
    const orders = await findOrders(userId, status);
    console.log("Orders found:", orders);
    return res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    next(error);
  }
};
