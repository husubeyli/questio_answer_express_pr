const asyncErrorWrapper = require('express-async-handler');
const Question = require('../models/Question');


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
});


const getQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const question = await Question.findById(id);


    return res.status(200)
    .json({
        success: true,
        data: req.data
    })
});


const editQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const questionData = req.body;

    let question = await Question.findById(id);

    question.title = questionData.title;
    question.content = questionData.content;

    question = await question.save();

    return res.status(200)
    .json({
        success: true,
        data: question
    })
});





module.exports = {
    askNewQuestion,
    getAllQuestions,
    getQuestion,
    editQuestion
};
