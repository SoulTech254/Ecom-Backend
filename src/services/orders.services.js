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

export const findOrders = async (userId, status = null) => {
  console.log("findOrders function called with arguments:", userId, status);
  try {
    // Initialize query to find orders by user ID
    let query = { user: userId };

    query.status = status;

    console.log("Query:", JSON.stringify(query, null, 2));

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

    console.log("Orders:", JSON.stringify(orders, null, 2));

    return orders;
  } catch (error) {
    console.error("Error in findOrders function:", error);
    throw error; // Re-throw the error for handling in the controller
  }
};

// src/services/orderService.js

export const updateOrderStatusByUser = async (userId, newStatus) => {
  const filter = { user: userId };
  console.log("Service - Filter:", JSON.stringify(filter, null, 2));
  console.log("Service - New Status:", newStatus);

  const result = await Order.updateMany(filter, {
    $set: { status: newStatus },
  });

  console.log("Service - Update Result:", result);
  return result;
};

export const getOrder = async (orderId) => {
  try {
    console.log("Finding order by ID:", orderId);
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("delivery.address")
      .populate("products.id")
      .populate("branch")
      .populate("payment")
      .exec();
    console.log("Order found:", order);
    return order;
  } catch (error) {
    console.error("Error retrieving order from service:", error);
    throw new Error("Error retrieving order.");
  }
};
