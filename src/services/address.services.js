import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const createAddress = async (userId, address) => {
  try {
    console.log(address);
    const newAddress = new Address({ address: { ...address }, user: userId });
    await newAddress.save();

    const user = await User.findByIdAndUpdate(userId, {
      $push: { addresses: newAddress._id },
    });

    const addresses = await Address.find({ user: userId });

    return addresses;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAddresses = async (userId) => {
  try {
    const addresses = await Address.find({ user: userId });
    return addresses;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateAddress = async (addressId, address) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...address },
      { new: true }
    );
    return updatedAddress;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteAddress = async (userId, addressId) => {
  try {
    // Delete the address document
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    // Remove the deleted address ID from the user's addresses field
    const user = await User.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId },
    });

    const addresses = await Address.find({ user: userId });

    return addresses;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAddress = async (addressId) => {
  try {
    const address = await Address.findById(addressId);
    return address;
  } catch (error) {
    throw new Error(error.message);
  }
};
