import { getAccessToken, getTimestamp } from "../utils/payment.utils.js";
import moment from "moment";

export const mpesaPayment = async (phoneNumber, amount) => {
  try {
    const token = await getAccessToken();
    const url =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const auth = "Bearer " + token;
    const timestamp = moment().format("YYYYMMDDHHmmss");
    console.log(timestamp);
    const password = new Buffer.from(
      "174379" +
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
        timestamp
    ).toString("base64");

    console.log(password);
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
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: 174379,
        PhoneNumber: phoneNumber,
        CallBackURL:
          "https://2889-41-204-187-5.ngrok-free.app/api/v1/payment/mpesa/callback",
        AccountReference: "CompanyXLTD",
        TransactionDesc: "Mpesa Daraja API stk push test",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to process M-Pesa payment");
    }

    const responseData = await response.json();
    console.log("Response: ", responseData);
    return responseData;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
