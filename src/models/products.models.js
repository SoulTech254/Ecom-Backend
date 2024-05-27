import mongoose from "mongoose";

const productsSchema = new mongoose.Schema(
  {
    category: {
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
    },
    productName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required:true,
    },
    SKU: {
      type: String,
    },
    measurementUnit: {
      type: String,
    },
    size: {
      type: String,
    },
    price: {
      type: String,
      required:true,
    },
    noOfUnits : {
        type: String
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productsSchema);

export default Product;
