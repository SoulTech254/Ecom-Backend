import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    level_1_name: {
      type: String,
      required: true,
    },
    level_2_name: {
      type: String,
      required: true,
    },
    level_3_name: {
        type: String,
      },
    productName: {
      type: String,
      required: true,
    },
    Brand: {
      type: String,
      required:true,
    },
    SKU: {
      type: String,
    },
    unitOfMeasurement: {
      type: String,
    },
    price: {
      type: String,
      required:true,
    },
    noOfUnits : {
        type: String
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productsSchema);

export default Product;
