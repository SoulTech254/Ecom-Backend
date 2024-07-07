import Product from "../models/products.models.js";
import { productExists } from "../utils/products.utils.js";
import Cart from "../models/cart.models.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

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

export const updateProduct = async (id, productData) => {
  const { productName, SKU, ...rest } = productData;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id },
      { productName, ...rest },
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

      return {
        message: "Product deleted successfully",
        product: deletedProduct,
      };
    } else {
      return { message: "Product deletion canceled", product: productToDelete };
    }
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
};

export const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If no cart exists for the user, create one
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product is already in the cart
    const cartItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex > -1) {
      // If the product is already in the cart, update the quantity
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it
      cart.items.push({ productId, quantity });
    }

    // Save the cart
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Error adding product to cart: ${error.message}`);
  }
};

export const getProduct = async (productId, branchId) => {
  try {
    // Validate product ID
    if (!ObjectId.isValid(productId)) {
      throw new Error("Invalid product ID");
    }

    // Validate branch ID
    if (!ObjectId.isValid(branchId)) {
      throw new Error("Invalid branch ID");
    }

    // Convert string IDs to ObjectId
    const productObjectId = ObjectId.createFromHexString(productId);
    const branchObjectId = ObjectId.createFromHexString(branchId);

    // Aggregate pipeline to fetch product with stock level for a specific branch
    const pipeline = [
      {
        $match: {
          _id: productObjectId, // Use the converted `productObjectId`
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "productId",
          as: "stockEntries",
        },
      },
      {
        $addFields: {
          stockLevel: {
            $first: {
              $filter: {
                input: "$stockEntries",
                as: "stock",
                cond: { $eq: ["$$stock.branchId", branchObjectId] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          stockLevel: { $ifNull: ["$stockLevel.stockLevel", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          images: 1,
          category: 1,
          brand: 1,
          price: 1,
          stockLevel: 1,
          stockEntries: 1, // Optional, include if needed
          // Exclude debug fields
        },
      },
    ];

    console.log("Executing aggregation pipeline:");
    console.log(JSON.stringify(pipeline, null, 2));

    const result = await Product.aggregate(pipeline);

    console.log("Aggregation pipeline result:");
    console.log(JSON.stringify(result, null, 2));

    return result[0];
  } catch (error) {
    console.error("Error getting product:", error);
    throw new Error("Error getting product!");
  }
};
