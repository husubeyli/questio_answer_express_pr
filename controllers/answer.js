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


module.exports = {
    askNewAnswerToQuestion
}