const express = require('express');
const tokenVerify = require('../middlewares/auth.jwt')
const router = express.Router();

const userAdresseCrtl = require('../controllers/userAdresse.controller');

router.get('/',tokenVerify.verifyToken,  userAdresseCrtl.getUserAdresses);
router.post('/', tokenVerify.verifyToken, userAdresseCrtl.addUserAdresse);
router.patch('/update', tokenVerify.verifyToken, userAdresseCrtl.updateUserAdresse)
router.delete('/delete', tokenVerify.verifyToken, userAdresseCrtl.deleteUserAdresse)

module.exports = router