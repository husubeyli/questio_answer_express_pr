const express = require('express');
const router = express.Router();

const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth.js')
const { blockUser, deleteUser } = require('../controllers/admin.js')
const { checkUserExist } = require('../middlewares/database/databaseErrorHelpers.js')

router.use([getAccessToRoute, getAdminAccess])

// router.use(checkUserExist);

// router.get('/', (req, res, next) => {
//     return res.status(200)
//     .json({
//         success: true,
//         message: 'Admin Page'
//     })
// })


router.get('/block/:id',checkUserExist, blockUser);

router.delete('/user/:id',checkUserExist, deleteUser);





module.exports = router;