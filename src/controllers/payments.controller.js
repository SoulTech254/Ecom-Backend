import Payment from "../models/payment.model.js";
import { handleMpesaPayment, updatePayment } from "../services/payment.services.js";
import { getAccessToken } from "../utils/payment.utils.js";

export const mpesaPaymentHandler = async (req, res, next) => {
  try {
    const {
      user,
      products,
      deliveryAddress,
      deliveryMethod,
      deliverySlot,
      totalQuantity,
      totalAmount,
      paymentAccount,
    } = req.body;
    console.log(req.body);
    const newOrder = {
      user: user.id,
      products: products.map((product) => product.id),
      delivery : {
        address: deliveryAddress.id,
        deliverySlot,
        method: deliveryMethod
      },
      totalQuantity,
      totalAmount,
      status: "pending",
    };
    console.log(newOrder, paymentAccount, totalAmount);
    const results = await handleMpesaPayment(
      newOrder,
      paymentAccount,
      totalAmount
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const callBackHandler = async (req, res, next) => {
  const {
    Body: {
      stkCallback: {
        MerchantRequestID,
        ResultCode,
        CallbackMetadata: { Item },
      },
    },
  } = req.body;
  const MpesaReceiptNumber = Item.find(
    (item) => item.Name === "MpesaReceiptNumber"
  ).Value;

  const updatedPayment = await updatePayment(
    MerchantRequestID,
    ResultCode,
    MpesaReceiptNumber
  );
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

export const getPaymentHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
};