import User from "../models/user.model.js";

export const userExists = async (phoneNumber) => {
  try {
    const existingUser = await User.findOne({ phoneNumber: phoneNumber });
    return !!existingUser;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false; 
  }
};
