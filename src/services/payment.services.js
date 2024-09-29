import Cart from "../models/cart.models.js";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";
import {
  generateOrderId,
  getAccessToken,
  getTimestamp,
  mockFetch,
} from "../utils/payment.utils.js";
import moment from "moment";

export const handleMpesaPayment = async (orderDetails, phoneNumber, amount) => {
  try {
    const number = Number(`254${phoneNumber}`);
    const amt = Number(amount); // Ensure this is a number
    console.log("Starting M-Pesa payment");
    console.log("Phone Number", number);
    const orderId = generateOrderId();

    const order = new Order({
      ...orderDetails,
      orderId: orderId,
    });
    console.log("Order created: ", order);

    const token = await getAccessToken();
    const url =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = `Bearer ${token}`;
    const timestamp = moment().format("YYYYMMDDHHmmss");

    const password = Buffer.from(
      `174379bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919${timestamp}`
    ).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        BusinessShortCode: 174379,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline", // Adjust as necessary
        Amount: amt,
        PartyA: number,
        PartyB: 174379,
        PhoneNumber: number,
        CallBackURL:
          "https://ecom-backend-qdwv.onrender.com/api/v1/payment/mpesa/callback",
        AccountReference: "CompanyXLTD",
        TransactionDesc: "Mpesa Daraja API stk push test",
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.text(); // Log full error response
      console.log(
        "Failed to process M-Pesa payment. Response: ",
        response,
        errorResponse
      );
      throw new Error("Failed to process M-Pesa payment");
    }

    const responseData = await response.json();
    console.log("Response: ", responseData);

    const merchantId = responseData.MerchantRequestID;
    const newPayment = new Payment({
      orderID: order._id,
      paymentMethod: "mpesa",
      paymentAmount: orderDetails.totalAmount,
      paymentStatus: "pending",
      transactionID: merchantId,
      merchantId: merchantId,
      user: orderDetails.user,
    });
    const cart = await Cart.findOneAndUpdate(
      { user: orderDetails.user },
      { $set: { products: [], totalQuantity: 0, totalAmount: 0 } },
      { new: true } // Ensure to return the updated document
    );

    order.payment = newPayment._id;
    newPayment.orderID = order._id;
    await newPayment.save();
    await order.save();
    console.log("Payment created: ", newPayment);
    return newPayment;
  } catch (error) {
    console.error(error);
    throw new Error(`M-Pesa Payment Error: ${error.message}`);
  }
};

export const updatePayment = async (
  MerchantRequestID,
  ResultCode,
  MpesaReceiptNumber
) => {
  try {
    console.log("Updating payment...");
    console.log("MerchantRequestID: ", MerchantRequestID);
    console.log("ResultCode: ", ResultCode);
    console.log("MpesaReceiptNumber: ", MpesaReceiptNumber);

    const payment = await Payment.findOne({ merchantId: MerchantRequestID });
    if (!payment) {
      console.log("Payment not found");
      throw new Error("Payment not found");
    }

    payment.paymentStatus = ResultCode === 0 ? "success" : "failed";

    if (ResultCode === 0) {
      payment.transactionID = MpesaReceiptNumber;
      console.log("Updated payment transactionID: ", payment.transactionID);
      // Send Email
    }

    await payment.save();
    console.log("Payment updated successfully");
    console.log("Updated payment: ", payment);
    return payment;
  } catch (error) {
    console.error("Error updating payment: ", error);
    throw new Error(error);
  }
};
