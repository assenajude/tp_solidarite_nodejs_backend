const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer.config')

const locationCtrl = require('../controllers/location.controller');

router.post('/',multer, locationCtrl.addNewLocation);
router.get('/', locationCtrl.getAllLocations);

module.exports = router