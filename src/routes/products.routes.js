import express from "express";

import { createProductHandler,
    productsPageHandler } from "../controllers/products.controller.js";

const router = express.Router();

router.post("/createProduct",createProductHandler);
router.get("/viewProducts",productsPageHandler);

export default router