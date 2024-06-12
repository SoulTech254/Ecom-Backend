import { mpesaPayment } from "../services/payment.services.js";
import { getAccessToken } from "../utils/payment.utils.js";
import WebSocket from 'ws';

export const mpesaPaymentHandler = async (req, res, next) => {
  try {
    const { phoneNumber, amount } = req.body;
    console.log(phoneNumber, amount);
    const results = await mpesaPayment(phoneNumber, amount);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const callBackHandler = async (req, res, next) => {
  const callbackData = req.body;
  console.log(callbackData);
};

export const registerURLHandler = async (req, res, next) => {
  try {
    const accessToken = await getAccessToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    const auth = "Bearer " + accessToken;

    const registrationData = {
      ShortCode: "174379",
      ResponseType: "[Cancelled/Completed]",
      ConfirmationURL:
        "https://9fb9-102-0-7-6.ngrok-free.app/api/v1/payment/mpesa/callback",
    };

    const response = await fetch(url, {
      headers: {
        Authorization: auth,
      },
      method: "POST",
      body: JSON.stringify(registrationData),
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error registering URL:", error);
    res.status(500).send("❌ Request failed");
  }
};
