import Order from "../models/order.model.js";
import { getAllOrders, findOrders } from "../services/orders.services.js";
import { pagination } from "../middlewares/paginationHandler.js";

// Controller to get all orders with pagination and status filter
// controllers/orders.controller.js

// controllers/orders.controller.js
export const getAllOrdersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.searchQuery || "";
    const sortOption = req.query.sortOption || "newest";
    const status = req.query.status || "";
    const deliveryMethod = req.query.method || "";

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

    const countFilter =
      searchConditions.length > 0 ? { $and: searchConditions } : {};

    const totalCount = await Order.countDocuments(countFilter).exec();
    results.metadata.totalCount = totalCount;
    results.metadata.totalPages = Math.ceil(totalCount / limit);

    if (startIndex >= totalCount) {
      return res.status(404).json({ message: "No such page exists" });
    }

    let queryBuilder =
      searchConditions.length > 0
        ? Order.find({ $and: searchConditions })
        : Order.find({});

    if (sortOption === "newest") {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    } else if (sortOption === "oldest") {
      queryBuilder = queryBuilder.sort({ createdAt: 1 });
    } else if (sortOption === "bestmatch") {
      // Example sorting for demonstration, modify as needed
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
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders." });
  }
};

// Controller to get orders by userId with pagination and status filter
export const getOrdersByUserIdController = async (req, res) => {
  try {
    const userId = req.query.userId;
    const status = req.query.status;
    const orders = await findOrders(userId, status);
    console.log(orders)
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders." });
  }
};
