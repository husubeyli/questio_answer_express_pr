const express = require('express')
const profileImageUpload = require('../middlewares/libraries/profileImageUpload')
const { register, getUser, login, logout, imageUpload, resetPasswordRequestController, getResetPasswordController, postResetPasswordController } = require('../controllers/auth')
const {
    getAccessToRoute,
} = require('../middlewares/authorization/auth');


const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/profile', getAccessToRoute, getUser)
router.get('/logout', getAccessToRoute, logout)
router.post("/request-reset-password", resetPasswordRequestController);
router.get("/reset-password", getResetPasswordController);
router.post("/reset-password-post", postResetPasswordController);


router.post('/uploads', [getAccessToRoute, profileImageUpload.single('profile_image')], imageUpload)



module.exports = router