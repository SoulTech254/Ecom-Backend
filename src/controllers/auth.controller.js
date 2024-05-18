import {
  createUser,
  updateUser,
  verifyUser,
} from "../services/auth.service.js";

export const createUserHandler = async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const verifyUserHandler = async (req, res, next) => {
  try {
    const user = await verifyUser(req.phoneNumber, req.code);
    res.status(200).json("user verified");
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.body);
    res.status(200).json("User Updated");
  } catch (error) {
    next(error);
  }
};
