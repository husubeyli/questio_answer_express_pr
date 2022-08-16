const multer  = require('multer');
const path = require('path');
const CustomError = require('../../helpers/error/CustomError');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const rootDir = path.dirname(require.main.filename);
        cb(null, rootDir + '/public/uploads');
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/')[1];
        req.savedProfileImage = "image_" + Date.now() + "." + extension;
        cb(null, req.savedProfileImage);
    }
});

const fileFilter = (req, file, cb) => {
    let allowedMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new CustomError('Please provide a valid profile image', 400), false);
    }
    return cb(null, true);
}


const profileImageUpload = multer({ storage, fileFilter });


module.exports = profileImageUpload;