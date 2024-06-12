import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    defaultAddress: {
      type: String,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    defaultPayment: {
      type: String,
    },
    paymentMethods: [
      {
        type: String,
      },
    ],
    toReceiveOffers: {
      type: Boolean,
      default: true,
    },
    DOB: {
      type: Date,
    },
    verificationCode: {
      type: String,
    },
    agreeTerms: {
      type: Boolean,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
