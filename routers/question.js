const express = require('express')

const router = express.Router()

const {
    getAccessToRoute, getQuestionOwnerAccess
} = require('../middlewares/authorization/auth');

const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelpers')

// api/questions
const { 
    askNewQuestion, getAllQuestions, getQuestion, editQuestion, deleteQuestion
} = require('../controllers/question')



router.get('/', getAccessToRoute, getAllQuestions)
router.get('/:id', checkQuestionExist, getQuestion)
router.post('/ask', getAccessToRoute, askNewQuestion);
router.put('/edit/:id', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete('/delete/:id', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion);


module.exports = router