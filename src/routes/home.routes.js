import express from "express";

import {
  homeProductsPageHandler,
  getProductHandler
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", homeProductsPageHandler);
router.get("/:id", getProductHandler);
export default router;
