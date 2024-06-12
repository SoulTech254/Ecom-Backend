import User from "../models/user.model.js";

export const updateUser = async (id, body) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const user = await User.findById(id);
    return user
  } catch (error) {
    throw error
  }
}
