const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');

const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');



const askNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params;
    const userId = req.user.id;

    const answerData = req.body;

    if (!question_id) {
        return next(new CustomError('There is not provide with id', 400))
    }

    const answer = await Answer.create({
        ...answerData,
        user: userId,
        question: question_id
    })

    return res.status(200)
    .json({
        success: true,
        data: answer
    })

});


const getAllAnswersByQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { question_id } = req.params;

    const question = await Question.findById(question_id).populate('answers')

    return res.status(200)
    .json({
        success: true,
        count: question.answers.length,
        data: question.answers
    })

});

// const getAnswerByQuestion = askNewAnswerToQuestion(async (req, res, next) => {
//     const { answersId } = req.params;

// });

module.exports = {
    askNewAnswerToQuestion,
    // getAnswerByQuestion,
    getAllAnswersByQuestion
}