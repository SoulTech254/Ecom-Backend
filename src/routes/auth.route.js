import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
  resetPasswordHandler,
  updatePasswordHandler,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", createUserHandler);
router.post("/verify-user", verifyUserHandler);
router.post("/reset-password", resetPasswordHandler);
router.put("/update-password", updatePasswordHandler);

export default router;
