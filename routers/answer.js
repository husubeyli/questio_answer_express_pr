const express = require('express')

const router = express.Router({mergeParams: true})

const { getAccessToRoute } = require('../middlewares/authorization/auth')
const { askNewAnswerToQuestion } = require('../controllers/answer')


router.post('/', getAccessToRoute, askNewAnswerToQuestion)


module.exports = router