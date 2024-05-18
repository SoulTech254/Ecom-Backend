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
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
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
    isReceivingOffers: {
      type: Boolean,
      default: true,
    },
    dateOfBirth: {
      type: Date,
    },
    verificationCode: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
