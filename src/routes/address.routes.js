import { Router } from "express";
import {
  createAddressHandler,
  deleteAddressHandler,
  getAddressHandler,
  getAddressesHandler,
  updateAddressHandler,
} from "../controllers/address.controller.js";

const router = Router();

router.get("/:userId", getAddressesHandler);
router.get("/:id", getAddressHandler);
router.put("/:id", updateAddressHandler);
router.delete("/:userId/:id", deleteAddressHandler);
router.post("/", createAddressHandler);

export default router
