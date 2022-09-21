const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Token = require('../models/Token');
const sendMail = require('../utils/email/sendEmail');

const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL || 'http://localhost:5001/api';
const subject = 'Password Reset';





const requestPasswordReset = async (email, next) => {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) next(new CustomError('No user with this email', 404));
    let token = await Token.findOne({ user: user._id });
    console.log(token);
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(20).toString("hex");
    const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
    console.log(hash, 'jamal');
    await new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();

    const link = `${clientURL}/auth/reset-password?token=${resetToken}&userId=${user._id}`;

    const payload = {
        name: user.name,
        link: link
    }
    // // send mail
    sendMail(user.email, subject, payload,  "./template/requestResetPassword.handlebars");
    return link
}

const resetPassword = async (userId, token, password, next) => {
    let passwordResetToken = await Token.findOne({ user: userId });

    if (!passwordResetToken) {
        // throw new Error("Invalid or expired password reset token");
        next(new CustomError("Invalid or expired password reset token", 400));

        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
            next(new CustomError("Invalid or expired password reset token", 400));
        };
    };

    // const user = await User.findOne
    //     { _id: userId },
    //     { password: password },
    //     { new: true }
    // );
    const user = await User.findById({ _id: userId });
    user.password = password;
    user._id = userId; 
    await user.save();
    await sendMail(
        user.email,
        "Password Reset Successfully",
        {
            name: user.name,
        },
        "./template/resetPassword.handlebars"
    );
    console.log('baxaqda')
    await passwordResetToken.deleteOne();

    return { success: true, message: 'Reset password succesfull changed!', data: user };
}

module.exports = {
    requestPasswordReset,
    resetPassword,
};
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