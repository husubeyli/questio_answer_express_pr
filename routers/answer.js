const express = require('express')

const router = express.Router({mergeParams: true})

const { getAccessToRoute } = require('../middlewares/authorization/auth')
const { askNewAnswerToQuestion, getAllAnswersByQuestion, getAnswerByQuestion } = require('../controllers/answer')
const { checkQuestionAndAnswerExist } = require('../middlewares/database/databaseErrorHelpers')


router.get('/:answer_id', checkQuestionAndAnswerExist, getAnswerByQuestion)
router.get('/', getAccessToRoute, getAllAnswersByQuestion)
router.post('/', getAccessToRoute, askNewAnswerToQuestion)


module.exports = router