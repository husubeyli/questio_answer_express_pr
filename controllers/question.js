const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');

const User = require('../models/User');
const Question = require('../models/Question')



const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {

    const questionData = req.body;

    const question = await Question.create({
        ...questionData,
        user: req.user.id,
    });
    

    return res.status(200)
    .json({
        success: true,
        data: question
    })
});


const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
    const questions = await Question.find()

    return res.status(200)
    .json({
        success: true,
        data: questions
    })
})





module.exports = {
    askNewQuestion,
    getAllQuestions
};