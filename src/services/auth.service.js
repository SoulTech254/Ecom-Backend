import User from "../models/user.model.js";
import { userExists } from "../utils/userUtils.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verificationUtils.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const { password, phoneNumber, ...rest } = userData;
  if (userExists(phoneNumber)) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const code = generateVerificationCode();
    const newUser = new User({
      ...rest,
      password: hashedPassword,
      phoneNumber,
      verificationCode: code,
    });
    try {
      await newUser.save();
      await sendVerificationCode(`+254${phoneNumber}`, code);
      return newUser;
    } catch (error) {
      return error;
    }
  }else{
    throw new Error("User already Exists")
  }
};

/**
 * Verifies a user by matching the verification code with the user's stored verification code.
 *
 * @param {string} phoneNumber - The phone number of the user to verify.
 * @param {string} code - The verification code to match.
 * @return {Promise<object>} The user object if verification is successful, otherwise an error.
 */
export const verifyUser = async (phoneNumber, code) => {
  try {
    const user = await User.findOne({ phoneNumber });
    if (user.verificationCode === code) {
      return user;
    } else {
      throw new Error("Invalid verification code");
    }
  } catch (error) {
    return error;
  }
};

export const updateUser = async (data) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { phoneNumber: data.phoneNumber },
      data,
      {
        new: true,
      }
    );
    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};
