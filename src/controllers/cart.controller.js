import { getCart, updateCart, mergeCart } from "../services/cart.service.js";

export const getCartHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cart = await getCart(id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedCart = await updateCart(
      id,
      req.body.product,
      req.body.quantity
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const mergeCartHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedCart = await mergeCart(id, req.body);
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};
