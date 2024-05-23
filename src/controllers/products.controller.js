import { createProduct } from "../services/products.service.js";
import { pagination } from "../middlewares/paginationHandler.js";
import Product from "../models/products.models.js";
export const createProductHandler = async (req, res, next) => {
    try {
      const newProduct = await createProduct(req.body);
      res.status(201).json("Product created");
    } catch (error) {
      next(error);
    }
  };

  export const productsPageHandler = [
    pagination(Product),
    (req, res) => {
        res.json(res.paginatedResults);
    }
];