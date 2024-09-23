import express from "express";

const router = express.Router();

import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getPaginatedCategories,
  addProducts,
} from "../controllers/category.controller.js";

router.get("/", getAllCategories);

router.get("/paginated", getPaginatedCategories);

router.post("/products", addProducts);

router.get("/:id", getCategoryById);

router.post("/", createCategory);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

export default router;
