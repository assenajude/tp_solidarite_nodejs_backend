const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.test.controller');
const veriryToken = require('../middlewares/auth.jwt')

router.get('/allAccess', userCtrl.allAccess);

router.get('/userAccess', [veriryToken.verifyToken], userCtrl.userBoard);

router.get('/mederatorAccess',[veriryToken.verifyToken, veriryToken.isModerator],userCtrl.moderatorBoard);

router.get('/adminAccess',[veriryToken.verifyToken, veriryToken.isAdmin],userCtrl.adminBoard);

module.exports = router