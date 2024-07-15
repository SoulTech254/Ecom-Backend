import Cart from "../models/cart.models.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import {
  handleMpesaPayment,
  updatePayment,
} from "../services/payment.services.js";
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
      branch
    } = req.body;


    console.log("deliveryAddress: ", deliveryAddress)

    // Create a new order
    const newOrder = {
      user: user.id,
      products: products.map(product => ({
        id: product.id,
        quantity: product.quantity
      })),
      delivery: {
        address: deliveryAddress.id,
        deliverySlot,
        method: deliveryMethod,
      },
      totalQuantity,
      totalAmount,
      status: "pending",
      branch:branch
    };


    console.log("New Order:", newOrder);

    // Handle M-Pesa payment
    const results = await handleMpesaPayment(
      newOrder,
      paymentAccount,
      totalAmount
    );

    console.log("UserID", user.id);
    
    const cart = await Cart.findOneAndUpdate(
      { user: user.id },
      { $set: { products: [], totalQuantity: 0, totalAmount: 0 } },
      { new: true } // Ensure to return the updated document
    );

    console.log("cart: ", cart);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const callBackHandler = async (req, res, next) => {
  console.log("Inside callBackHandler");
  console.log("req.body: ", req.body);
  const {
    Body: {
      stkCallback: {
        MerchantRequestID,
        ResultCode,
        CallbackMetadata: { Item },
      },
    },
  } = req.body;
  console.log("MerchantRequestID: ", MerchantRequestID);
  console.log("ResultCode: ", ResultCode);
  console.log("Item: ", Item);
  const MpesaReceiptNumber = Item.find(
    (item) => item.Name === "MpesaReceiptNumber"
  ).Value;
  console.log("MpesaReceiptNumber: ", MpesaReceiptNumber);

  const updatedPayment = await updatePayment(
    MerchantRequestID,
    ResultCode,
    MpesaReceiptNumber
  );
  console.log("updatedPayment: ", updatedPayment);

  return updatedPayment;
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
    next(error);
  }
};

export const getPaymentHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find payment by ID
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Determine response based on payment status
    let message = "";

    console.log(payment.paymentStatus);

    switch (payment.paymentStatus) {
      case "success":
        message = "Payment successful";
        break;
      case "failed":
        message = "Payment failed";
        break;
      case "pending":
        message = "Payment pending";
        break;
      default:
        message = "Unknown payment status";
        break;
    }

    // Send response
    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
