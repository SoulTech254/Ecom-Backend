import User from "../models/user.model.js";
import { userExists } from "../utils/userUtils.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verificationUtils.js";
import bcrypt from "bcrypt";

export const createUser = async (userData) => {
  const { password, phoneNumber, ...rest } = userData;
  try {
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
    } else {
      throw new Error("User already Exists");
    }
  } catch (error) {
    throw new Error(error.message);
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
  console.log(phoneNumber);
  try {
    const user = await User.findOne({ phoneNumber });
    if (user) {
      if (user.verificationCode === code) {
        return user;
      } else {
        throw new Error("Invalid verification code");
      }
    } else {
      throw new Error("User not found"); // or handle this case differently based on your requirements
    }
  } catch (error) {
    throw new Error(error.message);
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

export const resetPassword = async (phoneNumber) => {
  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      throw new Error("User not found");
    }
    const code = generateVerificationCode();
    user.verificationCode = code;
    await user.save();
    await sendVerificationCode(`+254${phoneNumber}`, code);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePassword = async (phoneNumber, password) => {
  try {
    const user = await User.findOne({ phoneNumber });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();
    return user;
  } catch (error) {
    throw new Error("Failed to update password");
  }
};
