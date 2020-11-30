const express = require('express')
const router = express.Router()
const colorAndSizeCrtl = require('../controllers/colorAndSize.controller')

router.get('/', colorAndSizeCrtl.getColorAndSize)
router.post('/couleurs',colorAndSizeCrtl.addCouleur)
router.post('/tailles', colorAndSizeCrtl.addTaille)

module.exports = router