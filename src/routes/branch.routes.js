import { Router } from "express";
import { getBranchesHandler } from "../controllers/branch.controllers.js";
import {getProductsWithStockLevelsController,getProductWithStockLevelController} from "../controllers/stocks.controller.js";


const router = Router();

router.get("/", getBranchesHandler);
// Route to get products with stock levels
router.get("/products", getProductsWithStockLevelsController);
// Route to get a specific product with stock level for a branch
router.get("/products/:productId/branch/:branchId", getProductWithStockLevelController);

export default router