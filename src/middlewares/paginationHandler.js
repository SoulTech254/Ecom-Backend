export function pagination(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    // Include the total count of the items in the collection
    results.totalCount = await model.countDocuments().exec();

    // Calculate and include the total number of pages
    results.totalPages = Math.ceil(results.totalCount / limit);

    if (endIndex < results.totalCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    const totalCount = await model.countDocuments().exec();
    if (startIndex >= totalCount) {
      return res.status(404).json({ message: "No such page exists" });
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
