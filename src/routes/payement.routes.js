const payementCtrl = require('../controllers/payement.controller')
const {isAdmin, verifyToken} = require('../middlewares/auth.jwt')
const express = require('express');
const router = express.Router();


router.post('/',[verifyToken, isAdmin], payementCtrl.addPayement);
router.get('/', payementCtrl.getAllPayement);
router.delete('/deleteOne',[verifyToken, isAdmin], payementCtrl.deletePayement)

module.exports = router