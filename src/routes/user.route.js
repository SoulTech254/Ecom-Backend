import express from "express";
import { updateUserHandler } from "../controllers/auth.controller.js";

const router = express.Router();

router.put("/update", updateUserHandler);

export default router;
