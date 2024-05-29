export function pagination(model, query = {}, options = {}) {
  return async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || options.limit || 10;
      const searchQuery = req.query.searchQuery || "";
      const sortOption = req.query.sortOption || "newest";

      const startIndex = (page - 1) * limit;

      const results = {
        metadata: {
          page,
          limit,
        },
      };

      const countFilter = searchQuery
        ? { ...query, productName: { $regex: searchQuery, $options: "i" } }
        : query;

      const totalCount = await model.countDocuments(countFilter).exec();
      results.metadata.totalCount = totalCount;

      results.metadata.totalPages = Math.ceil(totalCount / limit);

      if (startIndex >= totalCount) {
        return res.status(404).json({ message: "No such page exists" });
      }

      let queryBuilder = searchQuery
        ? model.find({
            ...query,
            productName: { $regex: searchQuery, $options: "i" },
          })
        : model.find(query);

      if (sortOption === "newest") {
        queryBuilder = queryBuilder.sort({ createdAt: -1 });
      } else if (sortOption === "oldest") {
        queryBuilder = queryBuilder.sort({ createdAt: 1 });
      } else if (sortOption === "bestmatch") {
        queryBuilder = queryBuilder.sort({ productName: 1 });
      }

      queryBuilder = queryBuilder.skip(startIndex).limit(limit);

      results.results = await queryBuilder.exec();

      if (startIndex + limit < totalCount) {
        results.next = {
          page: page + 1,
          limit,
        };
      }

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
