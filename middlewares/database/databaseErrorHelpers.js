const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../../helpers/error/CustomError')

const User = require('../../models/user.js')


const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return next(new CustomError('There is no such user with that id', 400))
    };

    req.data = user;

    next();
});


module.exports = {
    checkUserExist
};