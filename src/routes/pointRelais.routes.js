const express = require('express');
const router = express.Router();
const pointCtrl = require('../controllers/pointRelais.controller');
const {isAdmin, verifyToken} = require('../middlewares/auth.jwt')

router.post('/', pointCtrl.addPointRelais);
router.get('/', pointCtrl.getAllPoint);
router.delete('/deleteOne', [verifyToken, isAdmin], pointCtrl.deleteRelais)

module.exports = router