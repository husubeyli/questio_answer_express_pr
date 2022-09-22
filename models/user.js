const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Schema = mongoose.Schema; 

const Question = require('../models/Question.js')


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please provide a valid email'
        ]
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters'],
        required: [true, 'Password is required'],
        select: false // don't return password in query results
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
    },
    about: {
        type: String,
    },
    adress: {
        type: String,
    },
    website: {
        type: String,
    },
    profile_image: {
        type: String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});

// for generate JWT token || Model methods 
UserSchema.methods.generateJWTFromUser = function() {

    const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

    const payload = {
        id: this._id,
        name: this.name,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRES_IN
    })

    return token;
};

// for generate unique reset password token || Model methods
UserSchema.methods.generateResetPasswordToken = function () {
    const randomHexString = crypto.randomBytes(20).toString('hex');
    console.log(randomHexString);
}

// Signals 
UserSchema.pre('save', function(next) {
    const BCRYPT_SALT = process.env.BCRYPT_SALT;

    // if password not changed then don't hash it
    if(!this.isModified('password')) return next();

    console.log('pre save hooks working');
    bycrypt.genSalt(10, (err, BCRYPT_SALT) => {
        if (err) next(err)

        bycrypt.hash(this.password, BCRYPT_SALT, (err, hash) =>{
            if (err) next(err)
            this.password = hash;
            next();
        })

    })
    
});

UserSchema.post('remove', async function() {
    await Question.deleteMany({
        user: this._id
    })
})

module.exports = mongoose.model('User', UserSchema);