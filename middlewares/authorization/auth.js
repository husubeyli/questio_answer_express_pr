const CustomError = require('../../helpers/error/CustomError');
const jwt = require('jsonwebtoken');
const asyncErrorWrapper = require('express-async-handler');
const { isTokenIncluded, getAccessTokenFromHeader } = require('../../helpers/authorization/tokenHelpers');
const User = require('../../models/User')
const Question = require('../../models/Question')






const getAccessToRoute = (req, res, next) => {

    if( !isTokenIncluded(req) ) {
        return next(new CustomError('You are not authorized to access this route', 401));
    }

    const { JWT_SECRET_KEY } = process.env;
    const accessToken = getAccessTokenFromHeader(req);
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) return next(new CustomError('You are not authorized to access this route', 401));
        req.user = {
            id: decoded.id,
            name: decoded.name,
        }
        // console.log(decoded);
        next();
    }); 
    
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id)
    if ( user.role !== 'admin' ) {
        return next(new CustomError('Only admin can access this route', 403))
    }
    next();
});


const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    console.log(id, 'istidecinin idsi');
    const questionId = req.params.id;

    if(questionId != userId) {
        return next(new CustomError('Only owner can handle this operation!', 403))
    }
    next();
});




module.exports = {
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess
}