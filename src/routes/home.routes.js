import express from "express";
import { authenticate } from "../middlewares/authentation.middleware.js";

import {
  homeProductsPageHandler,
  getProductHandler,
  postCartProductsHandler,
  getBestSellersHandler
} from "../controllers/products.controller.js";
import { getBranchesHandler } from "../controllers/branch.controllers.js";

const router = express.Router();

router.get("/", homeProductsPageHandler);
router.get("/:id", getProductHandler);
router.post("/cart", authenticate, postCartProductsHandler);
router.get("/best-sellas", getBestSellersHandler);
router.get("/branchess", getBranchesHandler);

export default router;
