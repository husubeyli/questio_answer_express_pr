const express = require('express')

const router = express.Router()

const {
    getAccessToRoute,
} = require('../middlewares/authorization/auth');


// api/questions
const { askNewQuestion } = require('../controllers/question')



router.post('/ask', getAccessToRoute, askNewQuestion)


module.exports = router