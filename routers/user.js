const express = require('express');

const router = express.Router();
const { getUser, getAllUsers } = require('../controllers/user');
const { checkUserExist } = require('../middlewares/database/databaseErrorHelpers');



router.get('/', getAllUsers)
router.get('/:id',checkUserExist,  getUser)




module.exports = router