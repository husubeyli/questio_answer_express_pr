const asyncErrorWrapper = require('express-async-handler');
const { searchHelper, populateHelper, questionSortHelper, paginationHelper } = require('./queryMiddlewareHelpers');


const userQueryMiddleware = function(model, options) {
    return asyncErrorWrapper(async function(req, res, next) {
        let query =  model.find();
        
        // search by name
        query = searchHelper("name", query, req);

        const paginationResult = await paginationHelper(model, query, req);

        query = paginationResult.query;
        pagination = paginationResult.pagination;

        const queryResults = await paginationResult.query;

        res.queryResults = {
            success: true, 
            count: paginationResult.length,
            pagination: pagination,
            data: queryResults
        };
        next();
    });
}

module.exports = userQueryMiddleware