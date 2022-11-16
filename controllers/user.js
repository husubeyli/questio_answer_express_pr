const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');

const User = require('../models/User');



const getUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id); // middleware de user gonderdiyim ucun istifade elemirem bu fieldi burda req.data-n lazim olan user gelir
    
    return res.status(200)
    .json({
        success: true,
        data: req.data
    });

});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).json(res.queryResults)
})

module.exports = {
    getUser,
    getAllUsers
}