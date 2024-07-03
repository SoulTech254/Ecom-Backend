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
      required: true,
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
      required: true,
    },
    discountPrice: {
      type: String,
    },
    noOfUnits: {
      type: String,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

productsSchema.index({ productName: "text", SKU: "text", description: "text" });

const Product = mongoose.model("Product", productsSchema);

export default Product;
