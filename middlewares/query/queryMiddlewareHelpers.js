const searchHelper = (searchKey, query, req) => {
    if ( req.query.search ) {
        const searchObject = {};
        const regex = new RegExp(req.query.search, 'i');
        searchObject[searchKey] = regex;
        return query.where(searchObject);
    };
    return query
};


const populateHelper = (query, population) => {
    return query.populate(population);
};


// sort: req.query.sortBy = most-liked, most-answered
const questionSortHelper = (query, req) => { 
    const sortKey = req.query.sortBy;

    if( sortKey === "most-answered" ){
        return query.sort("-answerCount -createdAt") // when answerCount the same sorting -createdAt
    };

    if( sortKey === "most-liked" ){
        return query.sort('-likeCount -createdAt') // when likeCount the same sorting -createdAt
    } 
    return query.sort('-createdAt')
};


const paginationHelper = async (totalDocuments, query, req) => {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = totalDocuments;

    if( startIndex > 0 ) {
        pagination.previous = {
            page: page - 1,
            limit: limit
        };
    };
    // console.log(endIndex, total, startIndex, 'salam');
    if ( endIndex < total ) {
        pagination.next = {
            page: page + 1,
            limit: limit
        };
    };

    return {
        query: query === undefined ? undefined : query,
        pagination: pagination,
        startIndex,
        limit
    }
};


module.exports = {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
}