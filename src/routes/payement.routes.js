const payementCtrl = require('../controllers/payement.controller')
const express = require('express');
const router = express.Router();


router.post('/', payementCtrl.addPayement);
router.get('/', payementCtrl.getAllPayement);
router.delete('/deleteOne', payementCtrl.deletePayement)

module.exports = router