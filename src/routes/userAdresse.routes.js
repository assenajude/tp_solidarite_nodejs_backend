const express = require('express');
const tokenVerify = require('../middlewares/auth.jwt')
const router = express.Router();

const userAdresseCrtl = require('../controllers/userAdresse.controller');

router.get('/',tokenVerify.verifyToken,  userAdresseCrtl.getUserAdresses);
router.post('/', tokenVerify.verifyToken, userAdresseCrtl.addUserAdresse);

module.exports = router