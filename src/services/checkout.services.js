import Address from "../models/address.model.js";
import Cart from "../models/cart.models.js";
import User from "../models/user.model.js";
import { findNearestBranch } from "../utils/branch.utils.js";

export const initiateCheckout = async ({
  cart,
  delivery,
  payment,
  user,
  branch,
}) => {
  // Fetch documents from database
  const cartDocument = await Cart.findById(cart)
    .populate("products.product")
    .exec();
  const userDocument = await User.findById(user);

  // Initialize the delivery address
  let deliveryAddress = null;

  // If delivery method is not 'pick-up", fetch address details
  if (delivery.method !== "pick-up") {
    deliveryAddress = await Address.findById(delivery.address);
  }

  // Determine the delivery slot
  let deliverySlot;
  if (delivery.method === "express") {
    // Set the delivery slot to 30 minutes after payment
    deliverySlot = getThirtyMinutesAfterPayment();
  } else {
    // Use the provided delivery slot for other methods
    deliverySlot = delivery.deliverySlot;
  }

  // Find the nearest branch if delivery method is not 'pick-up'
  let nearestBranch = null;
  if (delivery.method !== "pick-up" && deliveryAddress) {
    nearestBranch = await findNearestBranch(
      deliveryAddress.address.location.coordinates
    );
  }

  console.log("Nearest Branch: ", nearestBranch);

  // Create order summary object
  const orderSummary = {
    user: {
      id: userDocument._id,
      name: `${userDocument.fName} ${userDocument.lName}`,
      email: userDocument.email,
      phoneNumber: userDocument.phoneNumber,
      cart: cart,
    },
    deliveryAddress:
      delivery.method !== "pick-up"
        ? {
            id: deliveryAddress._id,
            building: deliveryAddress.address.building,
            coordinates: deliveryAddress.address.location.coordinates,
            city: deliveryAddress.address.city,
            contactNumber: deliveryAddress.address.contactNumber,
            instructions: deliveryAddress.address.instructions,
            addressType: deliveryAddress.address.addressType,
          }
        : null,
    deliveryMethod: delivery.method,
    deliverySlot: deliverySlot,
    branch: nearestBranch ? nearestBranch._id : branch,
    products: cartDocument.products.map((item) => ({
      id: item.product._id,
      name: item.product.productName,
      quantity: item.quantity,
      price: item.product.discountPrice,
      subtotal: item.subtotal,
    })),
    totalQuantity: cartDocument.totalQuantity,
    originalAmount: cartDocument.totalAmount,
    totalSavings: cartDocument.totalSavings,
    totalAmount: cartDocument.totalAmount,
    paymentMethod: payment.paymentMethod,
    paymentAccount: payment.paymentAccount,
  };

  console.log("Order summary:", orderSummary);
  console.log("Payment: ", payment);

  return orderSummary;
};

// Helper function to get the current time plus 30 minutes
const getThirtyMinutesAfterPayment = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return now.toISOString(); // ISO format is commonly used
};
