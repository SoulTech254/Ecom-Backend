import express from "express";

import { createProductHandler,
    productsPageHandler } from "../controllers/products.controller.js";

const router = express.Router();

router.post("/",createProductHandler);
router.get("/",productsPageHandler);
router.get("/id",productsPageHandler);

export default router