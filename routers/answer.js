const express = require('express')

const router = express.Router({mergeParams: true})

const { getAccessToRoute } = require('../middlewares/authorization/auth')
const { askNewAnswerToQuestion, getAllAnswersByQuestion } = require('../controllers/answer')


// router.get('/:answer_id', getAccessToRoute, getAnswerByQuestion)
router.get('/', getAccessToRoute, getAllAnswersByQuestion)
router.post('/', getAccessToRoute, askNewAnswerToQuestion)


module.exports = router