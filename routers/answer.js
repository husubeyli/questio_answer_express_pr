const express = require('express')

const router = express.Router({mergeParams: true})

const { getAccessToRoute } = require('../middlewares/authorization/auth')



router.get('/', getAccessToRoute, askNewAnswerToQuestion)


module.exports = router