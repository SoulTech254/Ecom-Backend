import { Router } from "express";
import { getBranchesHandler } from "../controllers/branch.controllers.js";


const router = Router();

router.get("/", getBranchesHandler);

export default router