const CustomError = require('../../helpers/error/CustomError');


const customErrorHandler = (err, req, res, next) => {
    let customError = err;

    

    // console.log(err.name, 'adi ')
    if (err.name === 'SyntaxError') {
        customError = new CustomError('Unexpected Syntax', 400)
    }
    if (err.name === 'ValidationError' ) {
        customError = new CustomError(err.message, 400)
    }
    if(err.name === 'CastError') {
        customError = new CustomError('Please provide a valid id')
    }
    if ( err.code === 11000) {
        customError = new CustomError('This field already exist', 400)
    }
    // console.log(customError.message)
    // console.log(customError.statusCode, 'status');
    res.status(customError.statusCode || 500)
    .json({
        success: false,
        message: customError.message
    });
};



module.exports = customErrorHandler