const express = require('express');
const router = express.Router();
const pointCtrl = require('../controllers/pointRelais.controller');

router.post('/', pointCtrl.addPointRelais);
router.get('/', pointCtrl.getAllPoint);

module.exports = router