import { Router } from "express";
import { initiateCheckoutHandler } from "../controllers/checkout.controllers.js";
import { callBackHandler, mpesaPaymentHandler, getPaymentHandler } from "../controllers/payments.controller.js";

const router = Router();

router.post("/initiate", initiateCheckoutHandler);
router.post("/payment/mpesa", mpesaPaymentHandler);
router.post("/payment/mpesa/callback", callBackHandler);
router.post("/payment/mpesa/processing/:id", getPaymentHandler);

export default router;
