const express = require('express')
const router = express.Router()
const optionCtrl = require('../controllers/option.controller')

router.post('/', optionCtrl.addOption)

module.exports = router