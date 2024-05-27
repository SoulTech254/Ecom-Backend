import express from "express";

import {
  postProductHandler,
  getProductsPageHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
} from "../controllers/products.controller.js";

const router = express.Router();

router.post("/", postProductHandler);
router.get("/", getProductsPageHandler);
router.put("/:id", updateProductHandler);
router.delete("/", deleteProductHandler);
router.get("/:id", getProductHandler);
export default router;
