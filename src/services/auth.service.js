import User from "../models/user.model.js";
import {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  generateRefreshToken,
  userExists,
} from "../utils/userUtils.js";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "../utils/verificationUtils.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/userUtils.js";
import Cart from "../models/cart.models.js";
import mongoose from "mongoose";
import Admin from "../models/admin.model.js";
import PendingUser from "../models/pendingUser.model.js";

export const createUser = async (userData) => {
  const { password, email, ...rest } = userData;

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the user already exists in PendingUser or User collections
    const existingPendingUser = await PendingUser.findOne({
      email,
    }).session(session);
    const existingUser = await User.findOne({ email }).session(session);
    if (existingPendingUser) {
      throw new Error(
        "User already registered. Please Enter Verification Code"
      );
    }
    if (existingUser) {
      throw new Error("User already exists. Login");
    }

    // Hash password and generate verification code
    const hashedPassword = bcrypt.hashSync(password, 10);
    const verificationCode = generateVerificationCode();

    // Create and save the pending user with hashed password
    const newPendingUser = new PendingUser({
      ...rest,
      password: hashedPassword,
      email,
      verificationCode,
    });
    await newPendingUser.save({ session });

    // Send verification code to user's phone number (handle error after commit)
    try {
      await sendVerificationCode(newPendingUser.email, verificationCode);
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction if verification code cannot be sent
      await session.abortTransaction();
      throw new Error("Failed to send verification code ");
    }

    // Omit sensitive fields from returned user object
    const { password: pass, ...pendingUser } = newPendingUser.toObject();

    // End the session
    session.endSession();

    return pendingUser;
  } catch (error) {
    // Abort transaction on any error before commit
    await session.abortTransaction();
    session.endSession(); // End the session after aborting
    const err = new Error("Internal Server Error. Please Try Again");
    err.statusCode = 500;
    return err;
  }
};

export const verifyUser = async (email, code) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Check if the PendingUser exists
    const pendingUser = await PendingUser.findOne({ email }).session(session);
    if (!pendingUser) {
      const error = new Error("Verification expired");
      error.statusCode = 400; // Set specific status code
      throw error;
    }

    console.log("Found pending user:", pendingUser);

    // Step 2: Verify the code
    if (Number(pendingUser.verificationCode) !== Number(code)) {
      const error = new Error("Invalid verification code");
      error.statusCode = 400; // Set specific status code
      throw error;
    }

    console.log(
      "Verification code is valid. Creating new user in User collection."
    );

    const cart = new Cart();
    try {
      console.log("Saving new cart");
      await cart.save({ session });
      console.log("New cart saved successfully:", cart);
    } catch (error) {
      console.log("Error saving cart:", error.message);
      throw new Error("Error saving cart");
    }

    // Step 4: Create the user in the User collection
    const newUser = new User({
      fName: pendingUser.fName,
      lName: pendingUser.lName,
      gender: pendingUser.gender,
      phoneNumber: pendingUser.phoneNumber,
      email: pendingUser.email,
      password: pendingUser.password,
      toReceiveOffers: pendingUser.toReceiveOffers,
      DOB: pendingUser.DOB,
      cart: cart._id,
      agreeTerms: pendingUser.agreeTerms,
    });

    console.log("Saving new user");
    await newUser.save({ session });

    console.log("New user saved. Updating cart with new user reference.");
    cart.user = newUser._id; // Now we can set the user reference
    await cart.save({ session });

    console.log("New cart saved. Removing pending user document.");
    // Step 6: Remove the pending user document
    await PendingUser.deleteOne({
      phoneNumber: pendingUser.phoneNumber,
    }).session(session);

    console.log("Pending user document removed. Committing transaction.");
    // Commit the transaction
    await session.commitTransaction();

    console.log(
      "Transaction committed. Omitting sensitive fields from returned user object"
    );

    // Omit sensitive fields from returned user object
    const { password: pass, ...user } = newUser.toObject();

    console.log("Returning user:", user);

    // End the session
    session.endSession();

    return { success: true, user }; // Return a success response
  } catch (error) {
    console.log("Verification failed:", error.message);
    await session.abortTransaction();
    session.endSession();

    // If no statusCode is set, default to 500
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500; // Maintain the status code if set
    throw err; // Re-throw the error to be caught in the handler
  }
};

export const verifyRegisteredOTP = async (email, code) => {
  const user = await User.findOne({ verificationCode: code });
  if (!user) {
    throw new Error("Expired Verification Code");
  }

  if (Number(code) !== Number(user.verificationCode)) {
    throw new Error("Invalid Verification Code");
  }

  return { success: true };
};

export const updateUser = async (data) => {
  try {
    const updatedUser = await PendingUser.findOneAndUpdate(
      { phoneNumber: data.phoneNumber },
      data,
      {
        new: true,
      }
    );
    return updatedUser;
  } catch (error) {
    const err = new Error("Internal Server Error. Please Try Again");
    err.statusCode = 500;
    return err;
  }
};

export const resetPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const code = generateVerificationCode();
    user.verificationCode = code;
    await user.save();
    await sendVerificationCode(email, code);
  } catch (error) {
    const err = new Error("Internal Server Error. Please Try Again");
    err.statusCode = 500;
    return err;
  }
};

export const updatePassword = async (email, password) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Find the user by email
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404; // Not found status code
      throw error;
    }

    // Step 2: Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Step 3: Update the user's password
    user.password = hashedPassword;

    // Step 4: Save the user
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    
    // Omit sensitive fields from returned user object
    const { password: pass, ...updatedUser } = user.toObject();
    
    // End the session
    session.endSession();

    return { success: true, user: updatedUser }; // Return a success response
  } catch (error) {
    console.log("Password update failed:", error.message);
    await session.abortTransaction();
    session.endSession();

    // If no statusCode is set, default to 500
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500; // Maintain the status code if set
    throw err; // Re-throw the error to be caught in the handler
  }
};


export async function logIn(email, password) {
  console.log("Logging in with email:", email, "and password:", password);

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      console.log("User does not exist in the database");
      const error = new Error("User not found");
      error.statusCode = 404; // Set specific status code
      throw error;
    }

    console.log("User exists, checking password...");
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      console.log("Password is invalid");
      const error = new Error("Invalid Credentials");
      error.statusCode = 401; // Set specific status code
      throw error;
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
    
    existingUser.refreshToken = generatedRefreshToken; // Use generated token
    await existingUser.save({ session }); // Save within the session

    console.log("Successfully logged in, returning user data");
    // Commit the transaction
    await session.commitTransaction();

    return { user, accessToken, generatedRefreshToken };
  } catch (error) {
    console.log("Login failed:", error.message);
    await session.abortTransaction();
    // If no statusCode is set, default to 500
    const err = new Error(error.message || "Internal Server Error. Please Try Again");
    err.statusCode = error.statusCode || 500; // Maintain the status code if set
    throw err; // Re-throw the error to be caught in the handler
  } finally {
    // End the session regardless of success or error
    session.endSession();
  }
}

export const resendOtp = async (email) => {
  console.log("Resending OTP for:", email);

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await PendingUser.findOne({ email }).session(session);
    if (!user) {
      const error = new Error("OTP expired. Register Again");
      error.statusCode = 404; // Set specific status code
      throw error;
    }

    console.log(user);

    const code = generateVerificationCode();
    user.verificationCode = code;
    await user.save({ session }); // Save the user within the session

    console.log("Updated user:", user);

    // Attempt to send the verification code
    try {
      console.log("Attempting to send verification code");
      await sendVerificationCode(email, code);
      console.log("Verification code sent successfully");

      await session.commitTransaction(); // Commit if everything goes well

      // Return success message only if the entire process is successful
      return {
        success: true,
        message: "Verification code resent successfully.",
      };
    } catch (error) {
      console.log("Error sending verification code:", error.message);
      // Abort the transaction if sending the verification code fails
      await session.abortTransaction();
      const sendError = new Error("Failed to send verification code");
      sendError.statusCode = 500; // Set specific status code
      throw sendError;
    }
  } catch (error) {
    console.log("Error resending OTP:", error.message);
    // Abort transaction on any error before commit
    await session.abortTransaction();

    // If no statusCode is set, default to 500
    const err = new Error(
      error.message || "Internal Server Error. Please Try Again"
    );
    err.statusCode = error.statusCode || 500; // Maintain the status code if set
    throw err; // Re-throw the error to be caught in the handler
  } finally {
    // Ensure session is ended regardless of success or error
    session.endSession();
  }
};

export const createAdmin = async (details) => {
  const { email, password, ...rest } = details;

  // Check if the admin already exists
  const foundUser = await Admin.findOne({ email });
  if (foundUser) {
    throw new Error("Administrator already exists");
  }

  try {
    // Hash the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create a new admin instance
    const newAdmin = new Admin({
      email,
      password: hashedPwd,
      ...rest,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Optionally return the new admin object without the password
    const { password: _, ...adminData } = newAdmin.toObject();
    return adminData;
  } catch (error) {
    throw new Error("Error creating admin: " + error.message);
  }
};

export const loginAdmin = async (email, password) => {
  console.log("Logging in admin with email:", email);

  try {
    const foundAdmin = await Admin.findOne({ email });
    if (!foundAdmin) {
      console.log("Admin does not exist in the database");
      throw new Error("Admin Does Not Exist");
    }

    console.log("Admin exists, checking password...");
    const match = await bcrypt.compare(password, foundAdmin.password);
    if (!match) {
      console.log("Password is invalid");
      throw new Error("Invalid Credentials");
    }

    console.log("Password is valid, generating access token...");
    const accessToken = generateAdminAccessToken(foundAdmin);

    console.log("Generating refresh token...");
    const refreshToken = generateAdminRefreshToken(foundAdmin);
    console.log(refreshToken);

    // Save the refresh token to the admin document
    foundAdmin.refreshToken = refreshToken;
    await foundAdmin.save();

    console.log("Successfully logged in admin, returning data", foundAdmin);
    return {
      admin: {
        name: foundAdmin.firstName + foundAdmin.lastName,
        email: foundAdmin.email,
        role: foundAdmin.role,
        branch: foundAdmin.branch,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("An error occurred while logging in admin:", error.message);
    throw new Error(error.message);
  }
};
