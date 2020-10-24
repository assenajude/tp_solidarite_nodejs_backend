const express = require('express')
const router = express.Router()
const mainCtrl = require('../controllers/main.controller')

router.get('/', mainCtrl.getAllData)

module.exports = router