import { Router } from "express";
import {
  getUsersPageHandler,
  updateUserHandler,
  getUserHandler,
} from "../controllers/admUsers.controller.js";

const router = Router();

router.get("/", getUsersPageHandler);
router.put("/:id", updateUserHandler);
router.get("/:id", getUserHandler);
// router.delete("/", deleteProductHandler);
// router.get("/:id", getProductHandler);

export default router;
