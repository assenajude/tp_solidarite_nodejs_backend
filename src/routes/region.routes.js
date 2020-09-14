const express = require('express');
const router = express.Router();
const regionCtrl = require('../controllers/region.controller')

router.post('/', regionCtrl.addRegion);
router.get('/', regionCtrl.getAllRegions);

module.exports = router