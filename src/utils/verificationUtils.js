import twilio from "twilio";
import User from "../models/user.model.js";

/**
 * Generates a verification code between 100000 and 999999.
 *
 * @return {string} The generated verification code as a string.
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends a verification code to the provided phone number using Twilio API.
 *
 * @param {string} phoneNumber - The phone number to send the verification code to.
 * @param {string} verificationCode - The verification code to be sent.
 * @return {Promise<void>} A promise representing the completion of the message sending operation.
 */
export const sendVerificationCode = async (phoneNumber, verificationCode) => {
  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await twilioClient.messages.create({
    body: `Your verification code is: ${verificationCode}`,
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
};

/**
 * Saves the verification code for a given phone number with expiry time and returns the updated user.
 *
 * @param {string} phoneNumber - The phone number for which the verification code is saved.
 * @param {string} verificationCode - The verification code to be saved.
 * @return {Promise<object>} A promise that resolves to the updated user object.
 */

