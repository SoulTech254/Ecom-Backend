import { Router } from "express";
import { getAllOrdersController } from "../controllers/orders.controller";
import { verifyJWT } from "../middlewares/verifyJWT";

const router = Router();

router.get("/orders", verifyJWT, getAllOrdersController);
router.put("/:id", updateUserHandler);
router.get("/:id", getUserHandler);
// router.delete("/", deleteProductHandler);
// router.get("/:id", getProductHandler);

export default router;
