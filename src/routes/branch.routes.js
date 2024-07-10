import { Router } from "express";
import { getBranchesHandler } from "../controllers/branch.controllers.js";
import {getProductsWithStockLevelsController} from "../controllers/stocks.controller.js";


const router = Router();

router.get("/", getBranchesHandler);
router.get("/products-with-stock",getProductsWithStockLevelsController);

export default router