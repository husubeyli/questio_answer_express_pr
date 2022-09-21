
const asyncErrorWrapper = require('express-async-handler');
const crypto = require('crypto');

const CustomError = require('../helpers/error/CustomError');
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const { validateUserInput, comparePassword } = require('../helpers/input/inputHelpers');
const User = require('../models/user');
const {
    requestPasswordReset,
    resetPassword,
} = require("../services/auth");



const register = asyncErrorWrapper(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
    })

    sendJwtToClient(user, res);
});


const login = asyncErrorWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError('Please check your inputs', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!comparePassword(password, user.password)) {
        return next(new CustomError('Invalid credentials', 401));
    }

    sendJwtToClient(user, res);
});


const logout = asyncErrorWrapper(async (req, res, next) => {
    const { NODE_ENV } = process.env;
    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === 'production' ? false : true,
    })
        .json({
            success: true,
            message: 'Logout successfull'
        })
});


const getUser = (req, res, next) => {
    res
        .json({
            success: true,
            data: {
                id: req.user.id,
                name: req.user.name,
            }
        })
}


const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, {
        'profile_image': req.savedProfileImage,
    }, {
        new: true,
        runValidators: true,
    });

    res
        .status(200)
        .json({
            success: true,
            message: 'Image uploaded successfully',
            data: user
        });
});


const resetPasswordRequestController = asyncErrorWrapper(async (req, res, next) => {
    const requestPasswordResetService = await requestPasswordReset(
        req.body.email, next
    );
    return res.status(200).json(requestPasswordResetService);
});


const getResetPasswordController  = asyncErrorWrapper(async (req, res, next) => {
    // console.log('buradayiq');
    return res.status(200).json({success: true, message: 'Please update password!'});
});

const postResetPasswordController  = asyncErrorWrapper(async (req, res, next) => {
    const { userId, token, password } = req.body;
    // console.log('buradayiq');
    if(!req.body.password) return next(new CustomError('Please enter password', 400));
    // if(!req.body.passwordConfirm) return next(new CustomError('Please enter password confirm', 400));
    if(req.body.password.length < 6) return next(new CustomError('Password must be at least 6 characters', 400));

    const resetPasswordService = await resetPassword(
        userId, token, password, next
    );
    return res.status(200).json(resetPasswordService);
});

// const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
//     const subject = 'Password Reset';
//     console.log(req.body, 'kamas');
//     const resentEmail = req.body.email;
//     const user = await User.findOne({ email: resentEmail });
//     console.log(user, 'lamas');

//     if(!user) return next(new CustomError('User not found', 404));

//     // const resetPasswordToken = user.generateResetPasswordToken();
//     console.log(user._id, 'user._id');
//     let token = await Token.findOne({ user: user._id });
//     console.log(crypto.randomBytes(20).toString('hex'), 'crypto.randomBytes(20).toString("hex")');
//     if(!token) {
//         const newToken = new Token({
//             userId: user._id,
//             token: crypto.randomBytes(20).toString('hex'),
//         }).save();
//     };
//     const link = `${process.env.CLIENT_URL}/auth/forgot-password-check/${user._id}/${token.token}`;
//     await sendMail(user.email, subject, link);


//     res
//     .status(200)
//     .json({
//         success: true,
//         message: 'password reset link sent to your email account',

//     });
// });


// const forgetPasswordCheck = asyncErrorWrapper(async (req, res, next) => {
//     const user = await User.findById(req.params.userId);
//     console.log(user, 'user geldi');
//     console.log(req.params.token, 'req.params.token');
//     if (!user) return next(new CustomError('invalid link or expired user', 400));
//     if (!req.body.password) return next(new CustomError('Please enter a new password', 400));
//     const new_password = req.body.password;

//     const token = await Token.findOne({ user: user._id , token: req.params.token });
//     if (!token) return next(new CustomError('invalid link or expired token', 400));
//     user.password = new_password;
//     await user.save();
//     await token.delete();
//     res
//     .status(200)
//     .json({
//         success: true,
//         message: 'password reset successfully',
//         data: user
//     });
// });


const updateProfile = asyncErrorWrapper(async (req, res, next) => {
    const editInformation = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true
    });
    
    return res.status(200)
    .json({
        success: true,
        data: user
    })
})



module.exports = {
    register,
    login,
    logout,
    getUser,
    imageUpload,
    resetPasswordRequestController,
    getResetPasswordController,
    postResetPasswordController,
    updateProfile
}


