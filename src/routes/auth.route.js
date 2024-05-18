import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", createUserHandler);
router.post("/verify-user", verifyUserHandler);

export default router;
