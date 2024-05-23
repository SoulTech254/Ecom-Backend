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

export const updateProduct = async (productData) => {
  const { productName, SKU, newSKU, ...rest } = productData;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { SKU: SKU },
      { productName, SKU: newSKU || SKU, ...rest },
      { new: true }
    );
    
    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

export const deleteProduct = async (productData) => {
  const { SKU, confirm } = productData;

  try {
    // Find the product by SKU
    const productToDelete = await Product.findOne({ SKU: SKU });

    if (!productToDelete) {
      throw new Error("Product not found");
    }

    // If confirm is true, proceed with deletion
    if (confirm === true) {
      const deletedProduct = await Product.findOneAndDelete({ SKU: SKU });

      return { message: "Product deleted successfully", product: deletedProduct };
    } else {
      return { message: "Product deletion canceled", product: productToDelete };
    }
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};

