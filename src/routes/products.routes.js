import express from "express";
import {
  postProductHandler,
  getProductsPageHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
} from "../controllers/products.controller.js";
import {
  addStockController,
  updateStockController,
  deleteStockController,
} from "../controllers/stocks.controller.js";

const router = express.Router();

router.post("/", postProductHandler);
router.put("/:id", updateProductHandler);
router.delete("/", deleteProductHandler);
router.get("/:id", getProductHandler);
router.get("/", getProductsPageHandler);

// Route to add a new stock entry
router.post("/stocks", addStockController);
// Route to update an existing stock entry
router.put("/stocks/:id", updateStockController);
// Route to delete a stock entry
router.delete("/stocks/:id", deleteStockController);

export default router;
