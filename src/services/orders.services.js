import Order from "../models/order.model.js";

export const getAllOrders = async () => {
  try {
    return await Order.find().exec();
  } catch (error) {
    console.error("Error retrieving orders from service:", error);
    throw new Error("Error retrieving orders.");
  }
};

export const findOrders = async (userId, method = null) => {
  try {
    // Initialize query to find orders by user ID
    let query = { user: userId };

    // If a method is provided, add it to the query
    if (method) {
      query["delivery.method"] = method;
    }

    const orders = await Order.find(query)
      .populate({
        path: "products.id",
        model: "Product",
        select: "productName description price images discountPrice", // Specify fields to select from Product
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

// src/services/orderService.js

export const updateOrderStatusByUser = async (orderId, newStatus) => {
  // Define filter to match by _id
  const filter = { _id: orderId };
  console.log("Service - Filter:", JSON.stringify(filter, null, 2));
  console.log("Service - New Status:", newStatus);

  // Update status of the specified order
  const updateResult = await Order.updateOne(filter, {
    $set: { status: newStatus },
  });

  console.log("Service - Update Result:", updateResult);

  // Retrieve and return the updated document
  if (updateResult.matchedCount === 0) {
    // If no document was matched, return null or handle the case accordingly
    console.log("Service - No document found with the given ID");
    return null;
  }

  const updatedDocument = await Order.findOne(filter)
    .populate("user")
    .populate("delivery.address")
    .populate("branch")
    .populate("payment")
    .populate("logistics");
  console.log("Service - Updated Document:", updatedDocument);

  return updatedDocument;
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
      .populate("logistics")
      .exec();
    console.log("Order found:", order);
    return order;
  } catch (error) {
    console.error("Error retrieving order from service:", error);
    throw new Error("Error retrieving order.");
  }
};

export const getOrdersService = async ({
  searchQuery,
  page,
  limit,
  sortOption,
  deliverySlot,
  status,
  method, // Updated parameter name
  startDate, // Updated parameter name
  endDate, // Updated parameter name
}) => {
  const startIndex = (page - 1) * limit;

  const searchConditions = [];

  // Search by orderId using searchQuery
  if (searchQuery) {
    const regex = new RegExp(searchQuery, "i");
    searchConditions.push({ orderId: regex });
  }

  // Filter by status
  if (status) {
    const statusRegex = new RegExp(status, "i");
    searchConditions.push({ status: statusRegex });
  }

  // Filter by delivery method
  if (method) {
    const methodRegex = new RegExp(method, "i");
    searchConditions.push({ "delivery.method": methodRegex });
  }

  // Filter by creation time range
  if (startDate) {
    searchConditions.push({
      createdAt: {
        $gte: new Date(startDate),
      },
    });
  }

  if (endDate) {
    searchConditions.push({
      createdAt: {
        $lte: new Date(endDate),
      },
    });
  }

  // Filter by delivery slot hour
  if (deliverySlot) {
    const targetHour = parseInt(deliverySlot, 10); // Assumes deliverySlot is a string like "09"
    searchConditions.push({
      $expr: {
        $eq: [
          { $hour: "$delivery.deliverySlot" }, // Extract hour from deliverySlot field
          targetHour,
        ],
      },
    });
  }

  const countFilter =
    searchConditions.length > 0 ? { $and: searchConditions } : {};

  const totalCount = await Order.countDocuments(countFilter).exec();

  let queryBuilder =
    searchConditions.length > 0
      ? Order.find({ $and: searchConditions })
      : Order.find({});

  if (sortOption === "newest") {
    queryBuilder = queryBuilder.sort({ createdAt: -1 });
  } else if (sortOption === "oldest") {
    queryBuilder = queryBuilder.sort({ createdAt: 1 });
  } else if (sortOption === "bestmatch") {
    queryBuilder = queryBuilder.sort({ "products.productName": 1 });
  }

  queryBuilder = queryBuilder.skip(startIndex).limit(limit);

  const results = await queryBuilder.exec();

  // Populate references
  await Order.populate(results, [
    { path: "user" },
    { path: "delivery.address" },
    { path: "products.id" },
    { path: "branch" },
    { path: "payment" },
  ]);

  return {
    metadata: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
    results,
    next: startIndex + limit < totalCount ? { page: page + 1, limit } : null,
    previous: startIndex > 0 ? { page: page - 1, limit } : null,
  };
};

export const updateOrderLogistics = async (orderId, newLogisticId) => {
  try {
    // Find and update the order by ID
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: { logistics: newLogisticId } },
      { new: true } // Return the updated document
    )
      .populate("logistics")
      .populate("user")
      .populate("products.id")
      .populate("branch")
      .populate("delivery.address")
      .populate("payment"
      )

    // Check if the order was found and updated
    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order logistics:", error);
    throw new Error(error.message);
  }
};
