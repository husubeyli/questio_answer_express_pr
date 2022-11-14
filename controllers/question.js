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
    let query = Question.find();
    const populate = true;
    const populateObject = {
        path: "user",
        select: "name profile_image"
    };

    // search
    if ( req.query.search ) {
        const searchObject = {};
        // title searchValue

        const regex = new RegExp(req.query.search, 'i');
        searchObject['title'] = regex;
        query = query.where(searchObject);
    };
    // populate
    if ( populate ) {
        query = query.populate(populateObject)
    };

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const pagination = {};
    const total = await Question.countDocuments()

    if( startIndex > 0 ) {
        pagination.previous = {
            page: page - 1,
            limit: limit
        };
    };

    if ( endIndex < total ) {
        pagination.next = {
            page: page + 1,
            limit: limit
        };
    };



    query = query.skip(startIndex).limit(limit)

    const questions = await query;
    return res.status(200)
    .json({
        success: true,
        count: questions.length,
        pagination: pagination,
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
    question.likeCount = question.likes.length;
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
    question.likeCount = question.likes.length;
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
