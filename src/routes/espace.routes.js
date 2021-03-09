const express = require('express')
const router = express.Router()
const espaceCtrl = require('../controllers/espace.controller')

router.post('/', espaceCtrl.createEspace)
router.get('/', espaceCtrl.getAllEspace)

module.exports = router