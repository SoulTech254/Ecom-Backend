import { getProductsWithStockLevels } from "../utils/stockLevels.js"

export const getProductsWithStockLevelsController = async (req, res) => {
  try {
    const { branchId, criteria, sortBy, sortOrder, page, limit } = req.query;

    const parsedCriteria = criteria ? JSON.parse(criteria) : {};
    const parsedSortOrder = parseInt(sortOrder) || -1;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;

    const result = await getProductsWithStockLevels(
      branchId,
      parsedCriteria,
      sortBy,
      parsedSortOrder,
      parsedPage,
      parsedLimit
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving products with stock levels:", error);
    res.status(500).json({ message: "Error retrieving products with stock levels." });
  }
};
