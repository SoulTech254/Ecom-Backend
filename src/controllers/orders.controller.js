import Order from '../models/order.model.js';
import { getAllOrders, findOrdersByUserId } from '../services/orders.services.js';
import { pagination } from '../middlewares/paginationHandler.js';

// Controller to get all orders with pagination and status filter
// controllers/orders.controller.js

// controllers/orders.controller.js
import { parse } from 'date-fns';

export const getAllOrdersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.searchQuery || "";
    const sortOption = req.query.sortOption || "newest";
    const status = req.query.status || "";
    const deliveryMethod = req.query.method || "";
    const startTime = req.query.startTime || "";
    const endTime = req.query.endTime || "";
    const deliverySlot = req.query.deliverySlot || "";

    const startIndex = (page - 1) * limit;

    const results = {
      metadata: {
        page,
        limit,
      },
    };

    const searchConditions = [];

    if (searchQuery) {
      const regex = new RegExp(searchQuery, "i");
      searchConditions.push({ status: regex });
    }

    if (status) {
      const statusRegex = new RegExp(status, "i");
      searchConditions.push({ status: statusRegex });
    }

    if (deliveryMethod) {
      const methodRegex = new RegExp(deliveryMethod, "i");
      searchConditions.push({ "delivery.method": methodRegex });
    }

    if (startTime) {
      searchConditions.push({
        createdAt: {
          $gte: new Date(startTime),
        },
      });
    }

    if (deliverySlot) {
      const parsedEndTime = parse(deliverySlot, "yyyy-MM-dd HH:mm", new Date());
      searchConditions.push({
        deliveryTime: {
          $lte: parsedEndTime,
        },
      });
    }

    const countFilter = searchConditions.length > 0 ? { $and: searchConditions } : {};

    const totalCount = await Order.countDocuments(countFilter).exec();
    results.metadata.totalCount = totalCount;
    results.metadata.totalPages = Math.ceil(totalCount / limit);

    if (startIndex >= totalCount) {
      return res.status(404).json({ message: "No such page exists" });
    }

    let queryBuilder = searchConditions.length > 0
      ? Order.find({ $and: searchConditions })
      : Order.find({});

    if (sortOption === "newest") {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    } else if (sortOption === "oldest") {
      queryBuilder = queryBuilder.sort({ createdAt: 1 });
    } else if (sortOption === "bestmatch") {
      queryBuilder = queryBuilder.sort({ productName: 1 });
    }

    queryBuilder = queryBuilder.skip(startIndex).limit(limit);

    results.results = await queryBuilder.exec();

    if (startIndex + limit < totalCount) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders.' });
  }
};

export const updateOrdersStatusByTimeSlot = async (req, res) => {
  try {
    const { startTime, deliverySlot, newStatus } = req.body;

    if (!startTime || !deliverySlot || !newStatus) {
      return res.status(400).json({ message: "startTime, deliverySlot, and newStatus are required" });
    }

    const filter = {
      createdAt: {
        $gte: new Date(startTime),
      },
      "delivery.deliverySlot": {
        $lte: deliverySlot,
      },
    };

    console.log('Filter:', JSON.stringify(filter, null, 2));

    const result = await Order.updateMany(filter, { $set: { status: newStatus } });

    console.log('Result:', result);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "No orders found matching the criteria" });
    }

    res.status(200).json({ message: `${result.modifiedCount} orders updated successfully` });
  } catch (error) {
    console.error('Error updating orders:', error);
    res.status(500).json({ message: 'Error updating orders.' });
  }
};

// src/controllers/orders.controller.js

import { updateOrderStatusByUser as updateOrderStatusByUserService } from '../services/orders.services.js';

export const updateOrderStatusByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { newStatus } = req.body;

    console.log('Controller - User ID:', userId);
    console.log('Controller - New Status:', newStatus);

    if (!newStatus) {
      console.log('Controller - Error: newStatus is required');
      return res.status(400).json({ message: "newStatus is required" });
    }

    const result = await updateOrderStatusByUserService(userId, newStatus);

    console.log('Controller - Service Result:', result);

    if (result.modifiedCount === 0) {
      console.log('Controller - No orders found for the specified user');
      return res.status(404).json({ message: "No orders found for the specified user" });
    }

    console.log(`Controller - ${result.modifiedCount} orders updated successfully`);
    res.status(200).json({ message: `${result.modifiedCount} orders updated successfully` });
  } catch (error) {
    console.error('Controller - Error updating orders:', error);
    res.status(500).json({ message: 'Error updating orders.' });
  }
};

 




// Controller to get orders by userId with pagination and status filter
export const getOrdersByUserIdController = async (req, res) => {
  try {
    const userId = req.query.userId;
    const status = req.query.status;

    const query = {};
    if (userId) {
      query.user = userId;
    }
    if (status) {
      query.status = status;
    }

    const orders = res.paginatedResults;
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ message: 'Error retrieving orders.' });
  }
};

// Applying pagination middleware to the routes

export const getOrdersByUserId = [
  pagination(Order, {}, { limit: 10 }, ['user', 'status']),
  getOrdersByUserIdController,
];
