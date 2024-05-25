import Categories from "../models/categories.models.js";

export const createCategorie = async (categorieData) => {
  const { level_1_name, level_2_name, ...rest } = categorieData;

  try {
    const newCategorie = new Categories({
      level_1_name,
      level_2_name,
      ...rest,
    });

    await newCategorie.save();
    return newCategorie;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCategorie = async (categorieData) => {
  const { level_1_name,newLevel_1_name,...rest } = categorieData;

  try {
    const updatedCategorie = await Categories.findOneAndUpdate(
      { level_1_name: level_1_name },
      { level_1_name, level_1_name: newLevel_1_name || level_1_name, ...rest },
      { new: true }
    );
    
    if (!updatedCategorie) {
      throw new Error("updateCategorie not found");
    }

    return updatedCategorie;
  } catch (error) {
    throw new Error("Error updating categoreie: " + error.message);
  }
};
