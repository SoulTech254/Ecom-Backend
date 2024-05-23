export function pagination(model) {
  return async (req, res, next) => {
    /**
     * Generates pagination middleware for a given model.
     *
     * @param {Object} model - The model to paginate.
     * @return {Function} An async function that handles pagination for the given model.
     */
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    results.totalCount = await model.countDocuments().exec();

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

    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
