const mongoose = require('mongoose');
const Question = require('./Question');

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

AnswerSchema.pre('save',async function(next) {
    if(!this.isModified('user')) return next();

    try {    
        const question = await Question.findById(this.question);
        question.answers.push(this._id)
        
        await question.save();
        next()
    }
    catch(err) {
        next(err)
    }

})


module.exports = mongoose.model('Answer', AnswerSchema);