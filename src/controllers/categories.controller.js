import {    createCategorie, 
            updateCategorie,
     } from "../services/categories.service.js";
import { pagination } from "../middlewares/paginationHandler.js";
import Categories from "../models/categories.models.js";
import { categoryExists } from "../utils/products.utils.js";

export const postCategorieHandler = async (req, res, next) => {
try {
const newCategorie = await createCategorie(req.body);
res.status(201).json({message:"cartegorie created",newCategorie:newCategorie});
} catch (error) {
next(error);
}

const categoryExists = async (name) => {
  try {
    const existingUser = await User.find({ phoneNumber: phoneNumber });
    return !!existingUser;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false; 
  }
};
};

export const getCategoriesPageHandler = [
pagination(Categories),
(req, res) => {
  res.json(res.paginatedResults);
}
];

export const updateCategorieHandler = async (req, res) => {
try {
const updatedCategorie = await updateCategorie(req.body);
res.status(200).json({ success: true, Categorie: updatedCategorie });
} catch (error) {
res.status(400).json({ success: false, message: error.message });
}
};
