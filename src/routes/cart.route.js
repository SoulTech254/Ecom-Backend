import express, { Router } from "express";
import {
  getCartHandler,
  updateCartHandler,
  mergeCartHandler,
  deleteProductHandler
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/:id", getCartHandler);
router.post("/:id", updateCartHandler);
router.post("/merge/:id", mergeCartHandler);
router.delete("/product/:id", deleteProductHandler)

export default router;
