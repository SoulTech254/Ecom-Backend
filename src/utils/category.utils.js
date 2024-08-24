import Category from "../models/category.models.js";
export const populateCategoryAncestors = async (categoryId, depth = 0) => {
  const category = await Category.findById(categoryId).populate("parent");

  if (!category || !category.parent || depth >= 10) {
    // Limit recursion to avoid infinite loops
    return category;
  }

  category.parent = await populateCategoryAncestors(
    category.parent._id,
    depth + 1
  );

  return category;
};

export const addCategory = async (
  name,
  description,
  parent = null,
  imageUrl
) => {
  try {
    let parentPath = [];

    if (parent) {
      // Find the parent category and get its path
      const parentCategory = await Category.findById(parent).exec();
      if (!parentCategory) {
        throw new Error("Parent category not found");
      }
      parentPath = parentCategory.path || []; // Get the path from the parent category
    }

    // Create a new category with the updated path
    const newCategory = new Category({
      name,
      description,
      parent: parent,
      imageUrl,
      path: parentPath.concat(parent || []), // Append the parent ID to the path
    });

    await newCategory.save();
    return newCategory;
  } catch (error) {
    throw error;
  }
};

export const findAllDescendantCategories = async (parentId) => {
  // Find direct children of the parent category
  const subcategories = await Category.find({ parent: parentId }).select("_id");

  let allCategoryIds = subcategories.map((cat) => cat._id);

  // For each subcategory, find its descendants
  for (const subcategory of subcategories) {
    const descendantCategoryIds = await findAllDescendantCategories(
      subcategory._id
    );
    allCategoryIds = allCategoryIds.concat(descendantCategoryIds);
  }
  allCategoryIds.push(parentId);

  return allCategoryIds;
};
