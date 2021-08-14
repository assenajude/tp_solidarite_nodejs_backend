const express = require('express');
const router = express.Router();

const locationCtrl = require('../controllers/location.controller');

router.post('/',locationCtrl.addNewLocation);
router.get('/', locationCtrl.getAllLocations);
router.delete('/deleteOne', locationCtrl.deleteLocation)

module.exports = router