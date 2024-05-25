import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.service.js";
import { pagination } from "../middlewares/paginationHandler.js";
import Product from "../models/products.models.js";
export const postProductHandler = async (req, res, next) => {
  try {
    const newProduct = await createProduct(req.body);
    res
      .status(201)
      .json({ message: "product created", newProduct: newProduct });
  } catch (error) {
    next(error);
  }
};

export const getProductsPageHandler = [
  pagination(Product),
  (req, res) => {
    res.json(res.paginatedResults);
  },
];

export const updateProductHandler = async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.body);
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProductHandler = async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.body);
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
