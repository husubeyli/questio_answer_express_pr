const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
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
    });
});


const getAllQuestions = asyncErrorWrapper(async (req, res, next) => {
    const questions = await Question.find()

    return res.status(200)
    .json({
        success: true,
        data: questions
    });
});


const getQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    return res.status(200)
    .json({
        success: true,
        data: req.data
    });
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
    });
});


const deleteQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    // const question = await Question.findById(id);
    // question.remove()
    await Question.findByIdAndDelete(id);

    return res.status(200)
    .json({
        success: true,
        message: 'Question Deleted Successfully'
    });
});


const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const question = await Question.findById(id);
    
    if(question.likes.includes(userId)) {
        return next(new CustomError('You already liked this question!', 400));
    };

    question.likes.push(userId);
    await question.save();

    return res.status(200)
    .json({
        success: true,
        data: question
    });
});

const dislikeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const question = await Question.findById(id);

    if(!question.likes.includes(userId)) {
        return next(new CustomError(`You don't like this question anymore!`, 400));
    };

    const index = question.likes.indexOf(userId)
    question.likes.splice(index, 1);
    await question.save();

    return res.status(200)
    .json({
        success: true,
        data: question
    });
});




module.exports = {
    askNewQuestion,
    getAllQuestions,
    getQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    dislikeQuestion
};
