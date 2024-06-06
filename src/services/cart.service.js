import Cart from "../models/cart.models.js";
import mongoose from "mongoose";

export const getCart = async (id) => {
  try {
    const cart = await Cart.findById(id).populate({
      path: "products.product",
      select: "productName price images SKU", // Specify desired fields
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
    console.log(productId);
    const cart = await Cart.findById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }
    console.log(cart);
    console.log(quantity);

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
        product: new mongoose.Types.ObjectId(productId),
        quantity: quantity,
      });
    }

    console.log(cart);
    cart.populate({
      path: "products.product",
      select: "productName price images SKU", // Specify desired fields
    });

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
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products.push(...products);
    await cart.save();

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("Error merging cart");
  }
};

export const deleteProduct = async (cartId, productId) => {
  try {
    // Find the cart by its ID
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }

    // Find the index of the product in the cart's products array
    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    // Get the product details for quantity and subtotal
    const product = cart.products[productIndex];

    // Update the totalQuantity and totalAmount
    cart.totalQuantity -= product.quantity;
    cart.totalAmount -= product.subtotal;

    // Remove the product from the products array
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    return cart.populate({
      path: "products.product",
      select: "productName price images SKU", // Specify desired fields
    });
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
