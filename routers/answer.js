const express = require('express')

const router = express.Router({mergeParams: true})



router.get('/', (req, res, next) => {

    return res.send('Answer Route')
})


module.exports = router