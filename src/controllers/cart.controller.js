import { getCart, updateCart } from "../services/cart.service.js";

export const getCartHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cart = await getCart(id);
  } catch (error) {
    next(error);
  }
};

export const updateCartHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedCart = await updateCart(id, req.body);
    res.status(200).json({cart: updatedCart });
  } catch (error) {
    next(error);
  }
}