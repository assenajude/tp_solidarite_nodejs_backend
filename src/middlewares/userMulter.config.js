const multer = require('multer');

const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
};

const multerFilter = (req, file, cb) => {
    /*if (file.mimeType === 'image/png' || file.mimeType === 'image/jpeg' || file.mimeType === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }*/
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('choisissez une image valide svp'))
    } else {
        cb(undefined, true)
    }
}

module.exports = multer({fileFilter: multerFilter}).single('image')