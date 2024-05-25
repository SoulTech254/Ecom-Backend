import express from "express";

import { postCategorieHandler,
        getCategoriesPageHandler ,
        updateCategorieHandler } from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/viewCategories",getCategoriesPageHandler );
router.post("/createCategorie",postCategorieHandler);
router.put("/updateCategorie",updateCategorieHandler);

export default router