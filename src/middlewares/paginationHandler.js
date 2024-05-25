export function pagination(model, query = {}) {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      console.log("page: ", page);
      const limit = parseInt(req.query.limit) || 2;

      const startIndex = (page - 1) * limit;

      const results = {
        metadata: {
          page,
          limit,
        },
      };

      // Count total documents
      const totalCount = await model.countDocuments(query).exec();
      results.metadata.totalCount = totalCount;

      // Calculate total pages
      results.metadata.totalPages = Math.ceil(totalCount / limit);

      // Check if startIndex exceeds totalCount
      if (startIndex >= totalCount) {
        return res.status(404).json({ message: "No such page exists" });
      }

      // Fetch paginated results
      let queryBuilder = model.find(query).skip(startIndex).limit(limit);

      // Filter by productName if provided in query
      if (req.query.productName) {
        queryBuilder = queryBuilder.find({
          productName: req.query.productName,
        });
      }

      results.results = await queryBuilder.exec();

      // Determine if next page exists
      if (startIndex + limit < totalCount) {
        results.next = {
          page: page + 1,
          limit,
        };
      }

      // Determine if previous page exists
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit,
        };
      }

      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
