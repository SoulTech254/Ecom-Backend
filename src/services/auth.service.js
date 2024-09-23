import User from "../models/user.model.js";
import { generateRefreshToken, userExists } from "../utils/userUtils.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verificationUtils.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/userUtils.js";
import Cart from "../models/cart.models.js";

export const createUser = async (userData) => {
  const { password, phoneNumber, ...rest } = userData;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password and generate verification code
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationCode = generateVerificationCode();

    // Create a new cart for the user
    const cart = new Cart();
    await cart.save();

    // Create and save the new user with hashed password and cart reference
    const newUser = new User({
      ...rest,
      password: hashedPassword,
      phoneNumber,
      verificationCode,
      cart: cart._id, // Assign cart _id to user's cart field
    });
    await newUser.save();

    // Update the cart with the user reference
    cart.user = newUser._id; // Set the user reference in the cart
    await cart.save();

    // // Send verification code to user's phone number
    // await sendVerificationCode(`+254${phoneNumber}`, verificationCode);

    // Omit sensitive fields from returned user object
    const {
      password: pass,
      // verificationCode: code,
      ...user
    } = newUser.toObject();
    return user;
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
      throw new Error("User not found");
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

export async function logIn(email, password) {
  console.log("Logging in with email:", email, "and password:", password);
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      console.log("User does not exist in the database");
      throw new Error("User not found");
    }
    console.log("User exists, checking password...");
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      console.log("Password is invalid");
      throw new Error("Invalid Credentials");
    }
    console.log("Password is valid, generating access and refresh tokens...");
    const {
      password: userPassword,
      verificationCode,
      refreshToken,
      ...user
    } = existingUser.toObject();
    const accessToken = generateAccessToken(existingUser);
    const generatedRefreshToken = generateRefreshToken(existingUser);
    existingUser.refreshToken = refreshToken;
    await existingUser.save();
    console.log("Successfully logged in, returning user data");
    return { user, accessToken, generatedRefreshToken };
  } catch (error) {
    console.log("An error occurred while logging in:", error.message);
    throw new Error(error.message);
  }
}

export const resendOtp = async (phoneNumber) => {
  try {
    console.log(phoneNumber);
    const user = await User.findOne({ phoneNumber });
    console.log(user);
    const code = generateVerificationCode();
    user.verificationCode = code;
    await user.save();
    await sendVerificationCode(`+254${phoneNumber}`, code);
  } catch (error) {
    throw new Error(error.message);
  }
};
