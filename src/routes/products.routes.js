import express from "express";

import { postProductHandler,
        getProductsPageHandler,
        updateProductHandler,
        deleteProductHandler } from "../controllers/products.controller.js";

const router = express.Router();

router.post("/createProduct",postProductHandler);
router.get("/viewProducts",getProductsPageHandler);
router.put("/updateProduct",updateProductHandler);
router.delete("/deleteProduct",deleteProductHandler);
export default router