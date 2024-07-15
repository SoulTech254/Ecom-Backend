import Address from "../models/address.model.js";
import Cart from "../models/cart.models.js";
import User from "../models/user.model.js";
export const initiateCheckout = async ({ cart, delivery, payment, user, branch }) => {
  const cartDocument = await Cart.findById(cart)
    .populate("products.product")
    .exec();
  const addressDocument = await Address.findById(delivery.address);
  const userDocument = await User.findById(user);
  console.log(cartDocument, addressDocument, userDocument);

  // Create order summary object
  const orderSummary = {
    user: {
      id: userDocument._id,
      name: `${userDocument.fName} ${userDocument.lName}`,
      email: userDocument.email,
      phoneNumber: userDocument.phoneNumber,
      cart: cart,
    },
    deliveryAddress: {
      id: addressDocument._id,
      building: addressDocument.address.building,
      city: addressDocument.address.city,
      contactNumber: addressDocument.address.contactNumber,
      instructions: addressDocument.address.instructions,
      addressType: addressDocument.address.addressType,
    },
    deliveryMethod: delivery.method,
    deliverySlot: delivery.deliverySlot,
    products: cartDocument.products.map((item) => ({
      id: item.product._id,
      name: item.product.productName,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.subtotal,
    })),
    totalQuantity: cartDocument.totalQuantity,
    originalAmount: cartDocument.totalAmount,
    totalSavings: cartDocument.totalSavings,
    totalAmount: cartDocument.totalAmount - cartDocument.totalSavings,
    paymentMethod: payment.paymentMethod,
    paymentAccount: payment.paymentAccount,
    branch: branch
  };

  console.log("Order summary:", orderSummary);
  console.log("Payment: ", payment);

  return orderSummary;
};

export const createOrder = async ({ order }) => {
  const orderDocument = new Order(order);
  await orderDocument.save();
  return orderDocument;
};
