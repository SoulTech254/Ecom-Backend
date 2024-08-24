import {
  getProductsWithStockLevels,
  getProductWithStockLevel,
} from "../utils/stockLevels.js";
import { ObjectId } from "mongodb";
import Stock from "../models/stocks.model.js";
import Branch from "../models/branch.model.js";
import Product from "../models/products.models.js";
import mongoose from "mongoose";

export const getProductsWithStockLevelsController = async (req, res) => {
  try {
    const {
      branchId,
      criteria = "{}",
      sortBy = "createdAt",
      sortOrder = -1,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedCriteria = JSON.parse(criteria);
    const parsedSortOrder = parseInt(sortOrder, 10) || -1;
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 10;

    const result = await getProductsWithStockLevels(
      branchId,
      parsedCriteria,
      sortBy,
      parsedSortOrder,
      parsedPage,
      parsedLimit
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving products with stock levels:", error);
    res
      .status(500)
      .json({ message: "Error retrieving products with stock levels." });
  }
};

export const getProductWithStockLevelController = async (req, res) => {
  try {
    const { productId, branchId } = req.params;

    if (!ObjectId.isValid(productId) || !ObjectId.isValid(branchId)) {
      return res
        .status(400)
        .json({ message: "Invalid product ID or branch ID" });
    }

    const result = await getProductWithStockLevel(productId, branchId);

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving product with stock level:", error);
    res
      .status(500)
      .json({ message: "Error retrieving product with stock level." });
  }
};

// Add a new stock entry
export const addStockController = async (req, res) => {
  try {
    const { branchId, productId, stockLevel } = req.body;

    // Validate branchId and productId
    if (
      !mongoose.Types.ObjectId.isValid(branchId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid branch or product ID" });
    }

    // Check if branch and product exist
    const branchExists = await Branch.findById(branchId);
    const productExists = await Product.findById(productId);

    if (!branchExists || !productExists) {
      return res.status(404).json({ message: "Branch or Product not found" });
    }

    // Create new stock entry
    const newStock = new Stock({
      branchId,
      productId,
      stockLevel,
    });

    await newStock.save();
    res.status(201).json(newStock);
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ message: "Error adding stock" });
  }
};

// Update an existing stock entry

export const updateStockController = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockLevel } = req.body;

    // Validate stock ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid stock ID" });
    }

    const stockObjectId = new mongoose.Types.ObjectId(id);

    // Find and update stock entry
    const updatedStock = await Stock.findByIdAndUpdate(
      stockObjectId,
      { stockLevel },
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    res.status(200).json(updatedStock);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Error updating stock" });
  }
};

// Delete a stock entry
export const deleteStockController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate stock ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid stock ID" });
    }

    // Find and delete stock entry
    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    res.status(200).json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    next(error);
  }
};
