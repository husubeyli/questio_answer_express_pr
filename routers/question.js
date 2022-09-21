const express = require('express')

const router = express.Router()

const {
    getAccessToRoute,
} = require('../middlewares/authorization/auth');


// api/questions
const { askNewQuestion, getAllQuestions } = require('../controllers/question')



router.get('/', getAccessToRoute, getAllQuestions)
router.post('/ask', getAccessToRoute, askNewQuestion);


module.exports = router