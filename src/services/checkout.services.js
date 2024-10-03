import Address from "../models/address.model.js";
import Cart from "../models/cart.models.js";
import User from "../models/user.model.js";
import { findNearestBranch } from "../utils/branch.utils.js";
import { checkProductAvailability } from "../utils/stockLevels.js";

export const initiateCheckout = async ({
  cart,
  delivery,
  payment,
  user,
  branch,
}) => {
  console.log("initiateCheckout() called");

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
    deliverySlot = getThirtyMinutesAfterPayment();
  } else {
    deliverySlot = delivery.deliverySlot;
  }

  // Find the nearest branch if delivery method is not 'pick-up'
  let nearestBranch = null;
  if (delivery.method !== "pick-up" && deliveryAddress) {
    nearestBranch = await findNearestBranch(
      deliveryAddress.address.location.coordinates
    );
  }

  // Check product availability
  const { adjustedProducts, adjustments } = await checkProductAvailability(
    cartDocument.products,
    nearestBranch ? nearestBranch._id : branch
  );

  // Calculate total savings and total amount based on adjusted products
  const totalSavings = adjustedProducts.reduce((total, item) => {
    const productPrice = item.product.price; // Assuming the product has a price field
    const discountPrice = item.product.discountPrice || productPrice; // Fallback to price if discountPrice is not available
    return total + (productPrice - discountPrice) * item.quantity;
  }, 0);

  const totalAmount = adjustedProducts.reduce((total, item) => {
    return total + item.subtotal; // subtotal should already be calculated in the adjusted products
  }, 0);

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
    products: adjustedProducts.map((item) => ({
      id: item.product._id,
      image: item.product.images[0],
      name: item.product.productName,
      quantity: item.quantity,
      price: item.product.discountPrice,
      subtotal: item.subtotal,
    })),
    totalQuantity: adjustedProducts.reduce((total, item) => total + item.quantity, 0),
    totalSavings: totalSavings, // Total savings calculated from adjusted products
    totalAmount: totalAmount, // Total amount calculated from adjusted products
    paymentMethod: payment.paymentMethod,
    paymentAccount: payment.paymentAccount,
    adjustments: adjustments.length > 0 ? adjustments : undefined, // Include adjustments if any
  };

  console.log("Order summary:", orderSummary);

  return orderSummary;
};

// Helper function to get the current time plus 30 minutes
const getThirtyMinutesAfterPayment = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return now.toISOString(); // ISO format is commonly used
};
