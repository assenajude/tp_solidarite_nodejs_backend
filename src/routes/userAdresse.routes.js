const express = require('express');
const router = express.Router();

const userAdresseCrtl = require('../controllers/userAdresse.controller');

router.get('/', userAdresseCrtl.getUserAdresses);
router.post('/', userAdresseCrtl.addUserAdresse);

module.exports = router