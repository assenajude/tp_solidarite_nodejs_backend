const express = require('express');
const router = express.Router();

const locationCtrl = require('../controllers/location.controller');

router.post('/', locationCtrl.createLocation);

module.exports = router