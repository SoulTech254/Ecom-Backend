import express from "express";
import { updateUserHandler } from "../controllers/auth.controller.js";
import { getCartHandler, updateCartHandler } from "../controllers/cart.controller.js";

const router = express.Router();

router.put("/update", updateUserHandler);
router.get("/cart/:id", getCartHandler);
router.post("/cart/:id", updateCartHandler);

export default router;
