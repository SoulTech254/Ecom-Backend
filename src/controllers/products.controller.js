import {
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
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

export const homeProductsPageHandler = [
  pagination(Product,{},{limit:3}),
  (req, res) => {
    res.json(res.paginatedResults);
  },
];

export const updateProductHandler = async (req, res,next) => {
  try {
    const id = req.params.id;
    const updatedProduct = await updateProduct(id, req.body);
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req, res,next) => {
  try {
    const deletedProduct = await deleteProduct(req.body);
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    next(error);
  }
};

export const getProductHandler = async (req, res,next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

export const postCartProductsHandler =  async (req, res) => {
  const userId = req.user.id;
  const {productId, quantity } = req.body;

  try {
    const updatedCart = await addToCart(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};