const multer = require('multer');

const MIME_TYPES = {
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
/*        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimeType];*/
        cb(null, new Date().toLocaleDateString() + '_' + file.originalname);
    }
});

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

module.exports = multer({storage: storage, fileFilter: multerFilter}).array('images', 10)