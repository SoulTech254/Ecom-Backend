import mongoose from "mongoose";
import Product from "../models/products.models.js";

const ObjectId = mongoose.Types.ObjectId;
console.log("Entering getProductsWithStockLevels function");

export const getProductsWithStockLevels = async (
  branchId,
  criteria = {},
  sortBy = "createdAt",
  sortOrder = -1,
  limit = 10
) => {
  try {
    console.log("Received parameters:");
    console.log({ branchId, criteria, sortBy, sortOrder, limit });

    if (!ObjectId.isValid(branchId)) {
      console.error("Invalid branch ID:", branchId);
      throw new Error("Invalid branch ID");
    }

    const branchObjectId = ObjectId.createFromHexString(branchId);

    const pipeline = [
      { $match: criteria },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "productId",
          as: "stockEntries",
        },
      },
      {
        $addFields: {
          stockLevel: {
            $first: {
              $filter: {
                input: "$stockEntries",
                as: "stock",
                cond: { $eq: ["$$stock.branchId", branchObjectId] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          stockLevel: { $ifNull: ["$stockLevel.stockLevel", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          images: 1,
          category: 1,
          brand: 1,
          price: 1,
          stockLevel: 1,
        },
      },
      { $sort: { [sortBy]: sortOrder } }, // Sorting stage
      { $limit: limit },
    ];

    console.log("Executing aggregation pipeline:");
    console.log(JSON.stringify(pipeline, null, 2));

    const products = await Product.aggregate(pipeline);

    console.log("Aggregation pipeline result:");
    console.log(JSON.stringify(products, null, 2));

    console.log("Exiting getProductsWithStockLevels function");

    return products;
  } catch (error) {
    console.error("Error getting products with stock levels:", error);
    throw new Error("Error getting products with stock levels");
  }
};

export const getProductWithStockLevel = async (productId, branchId) => {
  try {
    console.log("Entering getProductWithStockLevel function");
    console.log(
      `Received parameters: productId=${productId}, branchId=${branchId}`
    );

    const pipeline = [
      {
        $match: {
          _id: productId,
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "productId",
          as: "stockEntries",
        },
      },
      {
        $addFields: {
          stockLevel: {
            $ifNull: [
              {
                $first: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$stockEntries",
                        as: "stock",
                        cond: { $eq: ["$$stock.branchId", branchId] },
                      },
                    },
                    as: "stock",
                    in: "$$stock.stockLevel",
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          images: 1,
          category: 1,
          brand: 1,
          price: 1,
          stockLevel: 1,
        },
      },
    ];

    console.log("Executing aggregation pipeline:");
    console.log(JSON.stringify(pipeline, null, 2));

    const result = await Product.aggregate(pipeline);
    console.log("Aggregation pipeline result:");
    console.log(JSON.stringify(result, null, 2));

    console.log("Exiting getProductWithStockLevel function");

    return result[0];
  } catch (error) {
    console.error("Error getting product with stock level:", error);
    throw new Error("Error getting product with stock level!");
  }
};
