const express = require('express');
const router = express.Router();

const verifySignUp = require('../middlewares/verifySignUp');
const userCtrl = require('../controllers/auth.controller')

router.post('/signup', [
    verifySignUp.checkDuplicateEmailOrUsername,
    verifySignUp.checkRolesExisted

], userCtrl.signup);

router.post('/signin', userCtrl.signin);
router.patch('/resetMail', userCtrl.sendResetInfoMail)
router.patch('/modifyInfos', userCtrl.modifyUserInfos)

module.exports = router;