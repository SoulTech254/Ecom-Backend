export function pagination(model, query = {}) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10;  // Default to limit 5 if not provided
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        // Include the total count of the items in the collection
        results.totalCount = await model.countDocuments(query).exec();

        // Calculate and include the total number of pages
        results.totalPages = Math.ceil(results.totalCount / limit);

        if (endIndex < results.totalCount) {
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        const totalCount = await model.countDocuments(query).exec();
        if (startIndex >= totalCount) {
            return res.status(404).json({ message: "No such page exists" });
        }

        try {
            let searchQuery = {};
            if (req.query.searchQuery) {
                // If searchQuery query parameter is provided, construct the search condition for productName
                const searchParam = req.query.searchQuery;
                searchQuery = { productName: new RegExp(searchParam, 'i') };
            }
        
            // Combine the base query with the search query if it exists
            const finalQuery = { ...query, ...searchQuery };
        
            // Perform the search with the constructed query
            results.results = await model.find(finalQuery).limit(limit).skip(startIndex).exec();
        
            // Attach the results to the response object
            res.paginatedResults = results;
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        
    };
}
