const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');

const User = require('../models/user.js');



const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    user.blocked = !user.blocked;
    await user.save();

    return res.status(200)
    .json({
        success: true,
        message: 'Blocked - Unblocked Scuccessfully'
    })
});


const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);
    await user.remove();

    return res.status(200)
    .json({
        success: true,
        message: 'User Deleted Successfully'
    })
});

module.exports = {
    blockUser,
    deleteUser
}