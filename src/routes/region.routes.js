const express = require('express');
const router = express.Router();
const regionCtrl = require('../controllers/region.controller')
const {isAdmin, verifyToken} = require('../middlewares/auth.jwt')


router.post('/',[verifyToken, isAdmin], regionCtrl.addRegion);
router.get('/', regionCtrl.getAllRegions);

module.exports = router