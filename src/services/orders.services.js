import mongoose from "mongoose";
import Order from "../models/order.model.js";

export const getAllOrders = async () => {
  try {
    return await Order.find().exec();
  } catch (error) {
    console.error("Error retrieving orders from service:", error);
    throw new Error("Error retrieving orders.");
  }
};

export const findOrders = async (userId, status) => {
  console.log(userId, status)
  try {
    // Initialize query to find orders by user ID
    let query = { user: userId };

    query.status = status;

    const orders = await Order.find(query)
      .populate({
        path: "products.id",
        model: "Product",
        select: "productName description price images", // Specify fields to select from Product
      })
      .populate({
        path: "delivery.address",
      })
      .populate({
        path: "branch",
        select: "name address",
      })
      .exec();
    return orders;
  } catch (error) {
    throw error; // Re-throw the error for handling in the controller
  }
};
