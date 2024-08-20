import express from "express";
import {
  postProductHandler,
  getProductsPageHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
  // getBestSellersHandler,
} from "../controllers/products.controller.js";
import {
  addStockController,
  updateStockController,
  deleteStockController,
} from "../controllers/stocks.controller.js";

const router = express.Router();

router.post("/", postProductHandler);
router.get("/", getProductsPageHandler);
// router.get("/best-sellers", getBestSellersHandler);
router.put("/:id", updateProductHandler);
router.delete("/", deleteProductHandler);
router.get("/:id", getProductHandler);

// Route to add a new stock entry
router.post("/stocks", addStockController);
// Route to update an existing stock entry
router.put("/stocks/:id", updateStockController);
// Route to delete a stock entry
router.delete("/stocks/:id", deleteStockController);

export default router;
