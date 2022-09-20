const express = require('express');
const router = express.Router();

const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth.js')


router.use([getAccessToRoute, getAdminAccess])

router.get('/', (req, res, next) => {
    return res.status(200)
    .json({
        success: true,
        message: 'Admin Page'
    })
})


module.exports = router;