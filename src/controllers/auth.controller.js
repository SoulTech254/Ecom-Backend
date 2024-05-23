import {
  createUser,
  updateUser,
  verifyUser,
  resetPassword,
  updatePassword,
  logIn,
  resendOtp,
} from "../services/auth.service.js";
import { userExists } from "../utils/userUtils.js";

export const createUserHandler = async (req, res, next) => {
  try {
    const { phoneNumber, ...rest } = req.body;
    const exist = await userExists(phoneNumber);
    if (exist) {
      throw new Error("User already exists");
    }
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const verifyUserHandler = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;
    const user = await verifyUser(phoneNumber, otp);
    res.status(200).json(user);
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

export const resetPasswordHandler = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const password = await resetPassword(phoneNumber);
    console.log(password);
    res.status(200).json("Password Updated");
  } catch (error) {
    next(error);
  }
};

export const updatePasswordHandler = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const pass = await updatePassword(phoneNumber, password);
    console.log(password);
    res.status(200).json("Password Updated");
  } catch (error) {
    next(error);
  }
};

export async function logInHandler(req, res, next) {
  try {
    const { email, password } = req.body;
    const { token, user } = await logIn(email, password);
    res
      .cookie(token, token, {
        httpOnly: true,
      })
      .json(user);
  } catch (error) {
    next(error);
  }
}

export const resendOtpHandler = async (req, res, next) => {
  try {
    console.log(req.body);
    const { phoneNumber } = req.body;
    console.log(phoneNumber);
    const code = await resendOtp(phoneNumber);
    res.status(200).json("OTP Resent");
  } catch (error) {
    next(error);
  }
};
