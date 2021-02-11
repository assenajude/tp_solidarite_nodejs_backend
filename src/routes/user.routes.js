const express = require('express');
const router = express.Router();
const mainUserCtrl = require('../controllers/user.controller')
const veriryToken = require('../middlewares/auth.jwt')
const userMuler = require('../middlewares/userMulter.config')

router.patch('/me/avatar',[veriryToken.verifyToken,userMuler], mainUserCtrl.addUserAvatar )
router.get('/me/avatar',veriryToken.verifyToken, mainUserCtrl.getUserProfileAvatar)
router.get('/me',veriryToken.verifyToken, mainUserCtrl.getConnectedUserData)
router.patch('/me/piece', [veriryToken.verifyToken,userMuler], mainUserCtrl.addUserPiece )
router.patch('/me/update', [veriryToken.verifyToken], mainUserCtrl.updateProfile)
router.get('/me/favoris', [veriryToken.verifyToken], mainUserCtrl.getUserFavoris)
router.patch('/me/favoris', [veriryToken.verifyToken], mainUserCtrl.toggleUserFavoris)


module.exports = router