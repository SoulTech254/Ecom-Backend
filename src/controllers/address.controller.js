import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from "../services/address.services.js";

export const createAddressHandler = async (req, res) => {
  try {
    const { userId, address } = req.body;
    console.log(userId, address);
    const createdAddress = await createAddress(userId, address);
    res.json(createdAddress);
  } catch (error) {
    console.log(error);
  }
};

export const getAddressHandler = async (req, res, next) => {
  try {
    const addressId = req.params.id;
    const address = await getAddress(addressId);
    res.json(address);
  } catch (error) {
    next(error);
  }
};

export const updateAddressHandler = async (req, res, next) => {
  try {
    const address = req.body;
    const addressId = req.params.id;
    const updatedAddress = await updateAddress(addressId, address);
    res.json(updatedAddress);
  } catch (error) {
    next(error);
  }
};

export const getAddressesHandler = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const addresses = await getAddresses(userId);
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

export const deleteAddressHandler = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(req.body);
    const addressId = req.params.id;
    const deletedAddress = await deleteAddress(userId, addressId);
    res.json(deletedAddress);
  } catch (error) {
    next(error);
  }
};
