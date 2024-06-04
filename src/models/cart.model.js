import mongoose from "mongoose";
import Product from "./products.models.js";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Define a method to calculate total quantity and total amount
cartSchema.methods.calculateTotal = async function () {
  let totalQuantity = 0;
  let totalAmount = 0;

  for (const item of this.products) {
    const product = await Product.findById(item.product);
    totalQuantity += item.quantity;
    totalAmount += item.quantity * parseFloat(product.price); // Assuming price is a String, parse it to a float
  }

  this.totalQuantity = totalQuantity;
  this.totalAmount = totalAmount;
};

// Middleware to recalculate totals before saving the cart
cartSchema.pre("save", async function (next) {
  await this.calculateTotal();
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
