import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const userExists = async (phoneNumber) => {
  try {
    const existingUser = await User.findOne({ phoneNumber: phoneNumber });
    return !!existingUser;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return false;
  }
};

export function generateAccessToken(User) {
  return jwt.sign({ email: User.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
  });
}

export function generateRefreshToken(User) {
  return jwt.sign({ email: User.email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn:  process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  });
}
