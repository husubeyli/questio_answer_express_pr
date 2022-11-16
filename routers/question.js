const express = require("express");

const {
    getAccessToRoute, getQuestionOwnerAccess
} = require("../middlewares/authorization/auth");

const { checkQuestionExist } = require("../middlewares/database/databaseErrorHelpers");

// api/questions
const { 
    askNewQuestion, getAllQuestions, getQuestion, editQuestion, deleteQuestion, likeQuestion, dislikeQuestion
} = require("../controllers/question");

const answer = require("./answer.js");

const questionQueryMiddleware = require("../middlewares/query/questionQueryMiddleware");
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware')
const Question = require("../models/Question")


const router = express.Router();


router.get("/", questionQueryMiddleware(Question,{
    population: {
        path: "user",
        select: "name profile_image"
    }
}), getAllQuestions);
router.get("/like/:id", [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get("/dislike/:id", [getAccessToRoute, checkQuestionExist], dislikeQuestion);
router.get("/:id", checkQuestionExist, answerQueryMiddleware(Question, {
    population: [
        {
            path: "user",
            select: "name profile_image"
        },
        {
            path: "answers",
            select: "content"
        }
    ]
}), getQuestion);
router.post("/ask", getAccessToRoute, askNewQuestion);
router.put("/edit/:id", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete("/delete/:id", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion);

// for answer controller 
router.use("/:question_id/answers", checkQuestionExist, answer);


module.exports = router;