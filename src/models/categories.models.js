import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    category: {
      level_1_name: {
        type: String,
      },
      level_2_name: {
        type: String,
      },
      level_3_name: {
          type: String,
        }, 
    },
  },
  { timestamps: true }
);

const Categories = mongoose.model("Categorie", categoriesSchema);

export default Categories;
