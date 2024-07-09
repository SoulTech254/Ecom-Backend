import mongoose from 'mongoose';
import Order from "../models/order.model.js";

export const getAllOrders = async () => {
    try {
      return await Order.find().exec();
    } catch (error) {
      console.error('Error retrieving orders from service:', error);
      throw new Error('Error retrieving orders.');
    }
  };

  
  export const findOrdersByUserId = async (userId) => {
    try {
      console.log('Received request to find orders by user ID:', userId);
      // Validate userId format (optional but recommended)
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }
      console.log('Valid user ID format confirmed');
      
      // Convert userId to ObjectId using 'new' keyword
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
      console.log('Converted userId to ObjectId:', objectIdUserId);
  
      // Find orders where user matches the provided userId
      const orders = await Order.find({ user: objectIdUserId });
      console.log('Orders found for user:', orders);
      return orders;
    } catch (error) {
      throw error; // Re-throw the error for handling in the controller
    }
  };
  