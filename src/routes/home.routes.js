import express from "express";
import { authenticate } from "../middlewares/authentation.middleware.js";

import {
  homeProductsPageHandler,
  getProductHandler,
  postCartProductsHandler
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", homeProductsPageHandler);
router.get("/:id", getProductHandler);
router.post("/cart",authenticate,postCartProductsHandler)
export default router;
