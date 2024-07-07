import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  location: {
    coordinates: {
      type: [Number],
    },
  },
  building: {
    type: String,
  },
  city: {
    type: String,
  },
  contactNumber: {
    type: String,
    required: true,
  },
});

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: addressSchema,
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
