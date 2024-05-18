import express from "express";
import {
  createUserHandler,
  logInHandler,
  verifyUserHandler,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", createUserHandler);
router.post("/verify-user", verifyUserHandler);
router.post("/logIn",logInHandler);

export default router;
