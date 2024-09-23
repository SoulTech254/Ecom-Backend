import express from "express";
import {
  getLogisticsController,
  getLogisticsByIdController,
  createLogisticsController,
  updateLogisticsController,
  deleteLogisticsController,
} from "../controllers/logistics.controllers.js";

const router = express.Router();

router.get("/", getLogisticsController);
router.get("/:id", getLogisticsByIdController);
router.post("/", createLogisticsController);
router.put("/:id", updateLogisticsController);
router.delete("/:id", deleteLogisticsController);

export default router;
