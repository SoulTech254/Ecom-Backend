import User from "../models/user.model";

export const userExists = async (criteria) => {
  try {
    const existingUser = await User.findOne(criteria);
    return !!existingUser;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false; 
  }
};
