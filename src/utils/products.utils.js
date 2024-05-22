import Product from "../models/products.models.js";

export const productExists = async (SKU) => {
    try {
      const existingProduct = await Product.findOne({SKU});
      return !!existingProduct;
    } catch (error) {
      console.error('Error checking product existence:', error);
      return false; 
    }
  };