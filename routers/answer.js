const express = require('express')

const router = express.Router({mergeParams: true})

const { getAccessToRoute, getAnserOwnerAccess } = require('../middlewares/authorization/auth')
const { askNewAnswerToQuestion, getAllAnswersByQuestion, getAnswerByQuestion, updateAnswer, deleteAnswer } = require('../controllers/answer')
const { checkQuestionAndAnswerExist } = require('../middlewares/database/databaseErrorHelpers')


router.get('/', getAccessToRoute, getAllAnswersByQuestion)
router.post('/', getAccessToRoute, askNewAnswerToQuestion)
router.get('/:answer_id', checkQuestionAndAnswerExist, getAnswerByQuestion)
router.put('/edit/:answer_id', [checkQuestionAndAnswerExist, getAccessToRoute, getAnserOwnerAccess], updateAnswer)
router.delete('/delete/:answer_id', [checkQuestionAndAnswerExist, getAccessToRoute, getAnserOwnerAccess], deleteAnswer)


module.exports = router