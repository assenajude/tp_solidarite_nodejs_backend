const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toLocaleDateString() + '_' + file.originalname);
    }
});

const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('choisissez une image valide svp'))
    } else {
        cb(undefined, true)
    }
}

module.exports = multer({storage: storage, fileFilter: multerFilter}).array('images', 10)
