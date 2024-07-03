import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: {
    location: {
      coordinates: {
        type: [Number],
      },
    },
    address: {
      type: String,
    },
    building: {
      type: String,
    },
    city:{
      type: String
    },
    apartment:{
      type: String
    },
    contactNumber: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      required: true,
    },
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

addressSchema.index({ location: "2dsphere" }); // Index for geospatial queries

const Address = mongoose.model("Address", addressSchema);

export default Address;
