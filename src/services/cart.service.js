import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

export const getCart = async (id) => {
  try {
    const cart = await Cart.findById(id).populate({
      path: "products.product",
      select: "productName price images", // Specify desired fields
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving cart");
  }
};

export const updateCart = async (id, productId, quantity) => {
  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Update product quantity (logic for adding/removing)
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // Product already exists in cart, update quantity
      cart.products[existingProductIndex].quantity += quantity;
      if (cart.products[existingProductIndex].quantity <= 0) {
        // Remove product from cart if quantity becomes 0 or negative
        cart.products.splice(existingProductIndex, 1);
      }
    } else {
      // New product, add it to the cart
      cart.products.push({
        product: mongoose.Types.ObjectId(productId),
        quantity: quantity,
      });
    }

    // Recalculate totals before saving
    await cart.calculateTotal();

    // Save the updated cart
    await cart.save();

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating cart");
  }
};

export const mergeCart = async (id, products) => {
  try {
    const cart = await Cart.findById(id);
    cart.products.push(...products);
    await cart.save();
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error merging cart");
  }
};
