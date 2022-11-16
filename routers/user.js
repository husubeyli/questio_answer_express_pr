const express = require('express');

const router = express.Router();

const { getUser, getAllUsers } = require('../controllers/user');
const { checkUserExist } = require('../middlewares/database/databaseErrorHelpers');
const userQueryMiddleware = require('../middlewares/query/userQueryMiddleware');
const User = require('../models/User.js')

router.get('/', userQueryMiddleware(User), getAllUsers)
router.get('/:id',checkUserExist,  getUser)




module.exports = router