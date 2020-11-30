const multer = require('multer');

const avatarConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'avatars')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toLocaleDateString() + '_' + file.originalname);
    }
});

const avatarFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('choisissez une image valide svp'))
    } else {
        cb(undefined, true)
    }
}

module.exports = multer({storage: avatarConfig, fileFilter: avatarFilter}).array('images', 2)