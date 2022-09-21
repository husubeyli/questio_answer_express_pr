const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../../helpers/error/CustomError')

const User = require('../../models/User.js')
const Question = require('../../models/Question.js')


const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return next(new CustomError('There is no such user with that id', 400))
    };

    req.data = user;

    next();
});

const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findById(id);

    if(!question) {
        return next(new CustomError('There is no question with this id'))
    }
    req.data = question;

    next()
});


module.exports = {
    checkUserExist,
    checkQuestionExist
};