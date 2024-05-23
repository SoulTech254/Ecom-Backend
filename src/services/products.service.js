import Product from "../models/products.models.js";
import { productExists } from "../utils/products.utils.js";

export const createProduct = async (productData) => {
  const { productName, SKU, ...rest } = productData;

  try {
    const exists = await productExists(SKU);
    if (exists) {
      throw new Error("Product already exists");
    }
    const newProduct = new Product({
      ...rest,
      productName,
      SKU,
    });

    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw new Error(error.message);
  }
};
