import Product from "../models/products.models.js";
import { productExists } from "../utils/products.utils.js";

export const createProduct = async (productData) => {
  const { productName, SKU, ...rest } = productData;
  
  try {
    const exists = await productExists(SKU);  // Await the result of the productExists function
    
    if (!exists) {  // Check if the product does not exist
      const newProduct = new Product({
        ...rest,
        productName,
        SKU,
      });
      
      await newProduct.save();
      return newProduct;
    } else {
      throw new Error("Product already exists");
    }
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
};
