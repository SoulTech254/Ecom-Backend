import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import { getAllOrders} from '../services/orders.services.js';
import { findOrdersByUserId } from '../services/orders.services.js';

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders.' });
  }
};export const getOrdersByUserIdController = async (req, res) => {
    try {
      console.log('Request received for orders');
  
      const userId = req.query.userId;
      console.log('Extracted userId from request:', userId);
  
      if (userId) { // Check if userId parameter exists in the query string
        console.log('Searching orders for userId:', userId);
        const orders = await findOrdersByUserId(userId);
        console.log('Orders found:', orders);
        return res.json(orders);
      } else {
        console.log('No userId provided, retrieving all orders');
        const allOrders = await getAllOrders();
        console.log('All orders retrieved:', allOrders);
        return res.json(allOrders);
      }
    } catch (error) {
      console.error('Error retrieving orders:', error);
      return res.status(500).json({ message: 'Error retrieving orders' });
    }
  };
  
