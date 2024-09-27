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
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyAdminJWT } from "../middlewares/verifyAdminJWT.js";

router.get(
  "/",
  verifyAdminJWT,
  verifyRoles("SuperAdmin", "admin"),
  getAllCategories
);

router.get("/paginated", getPaginatedCategories);

router.post("/products", addProducts);

router.get("/:id", getCategoryById);

router.post("/", verifyRoles("SuperAdmin"), createCategory);

router.put("/:id", verifyRoles("SuperAdmin"), updateCategory);

router.delete("/:id", verifyRoles("Admin", "SuperAdmin"), deleteCategory);

export default router;
