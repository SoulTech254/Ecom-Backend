import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import secretKey from "../configs/jwtConfigs.js";

export const userExists = async (phoneNumber) => {
  try {
    const existingUser = await User.findOne({ phoneNumber: phoneNumber });
    return !!existingUser;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false; 
  }
};


export function generateToken (User){
    const payload ={
        id:User._id,
        email : User.email,
        phonenumber : User.phonenumber
    }
    return jwt.sign(payload,secretKey,{expiresIn :"1h"})
}