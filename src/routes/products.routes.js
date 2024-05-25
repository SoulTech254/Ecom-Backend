import express from "express";

import {
  postProductHandler,
  getProductsPageHandler,
  updateProductHandler,
  deleteProductHandler,
} from "../controllers/products.controller.js";

const router = express.Router();

router.post("/", postProductHandler);
router.get("/", getProductsPageHandler);
router.put("/", updateProductHandler);
router.delete("/", deleteProductHandler);
export default router;
