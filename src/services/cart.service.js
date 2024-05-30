import Cart from "../models/cart.model.js";

export const getCart = async (id) => {
  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart.products;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving cart");
  }
};

export const updateCart = async (id, products) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { _id: id },
      { products: products },
      { new: true, runValidators: true }
    );

    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart.products;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating cart");
  }
};
