const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Please provide a title'],
        minlength: [10, 'Please provide a title at least 10 characters'],
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Answer', AnswerSchema);