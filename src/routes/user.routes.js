const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.test.controller');
const mainUserCtrl = require('../controllers/user.controller')
const veriryToken = require('../middlewares/auth.jwt')
const userMuler = require('../middlewares/userMulter.config')

router.get('/allAccess', userCtrl.allAccess);

router.get('/userAccess', [veriryToken.verifyToken], userCtrl.userBoard);

router.get('/mederatorAccess',[veriryToken.verifyToken, veriryToken.isModerator],userCtrl.moderatorBoard);

router.get('/adminAccess',[veriryToken.verifyToken, veriryToken.isAdmin],userCtrl.adminBoard);

router.patch('/users/me/avatar',veriryToken.verifyToken,userMuler, mainUserCtrl.addUserAvatar )
router.patch('/users/me/piece', [veriryToken.verifyToken],userMuler, mainUserCtrl.addUserPiece )
router.patch('/users/me/update', [veriryToken.verifyToken],userMuler, mainUserCtrl.updateProfile)

module.exports = router