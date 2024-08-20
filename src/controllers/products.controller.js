import {
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  getProduct,
} from "../services/products.service.js";
import { pagination } from "../middlewares/paginationHandler.js";
import Product from "../models/products.models.js";
import { getProductsWithStockLevels } from "../utils/stockLevels.js";
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
  pagination(Product, {}, {}, ["productName", "SKU"]),
  (req, res) => {
    res.json(res.paginatedResults);
  },
];

export const homeProductsPageHandler = async (req, res, next) => {
  const { branchId } = req.query;
  console.log("BranchId: ", branchId);
  try {
    const products = await getProductsWithStockLevels(
      branchId,
      {},
      "productName",
      1,
      19
    );

    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedProduct = await updateProduct(id, req.body);
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (req, res, next) => {
  try {
    const deletedProduct = await deleteProduct(req.body);
    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    next(error);
  }
};

export const getProductHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { branchName } = req.query;
    const product = await getProduct(id, branchName);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const postCartProductsHandler = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const updatedCart = await addToCart(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBestSellersHandler = async (req, res, next) => {
  try {
    const { branchId } = req.query;
    const products = await getProductsWithStockLevels(
      branchId,
      {},
      "productName",
      1,
      8
    );
    res.status(200).json(products);
  } catch (error) {
    res.send(error);
  }
};
