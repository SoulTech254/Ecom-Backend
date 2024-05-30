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
      required:true,
    },
    defaultAddress: {
      type: String,
    },
    addresses: [
      {
        street: {
          type: String,
        },
        city: {
          type: String,
        },
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
