const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');

const User = require('../models/User');



const getUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    
    return res.status(200)
    .json({
        success: true,
        data: req.data
    });

});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    const listUsers = await User.find()
    if (!listUsers) {
        return next(new CustomError('Users list is empty'))
    };

    return res.status(200)
    .json({
        success: true,
        data: listUsers
    })
})

module.exports = {
    getUser,
    getAllUsers
}