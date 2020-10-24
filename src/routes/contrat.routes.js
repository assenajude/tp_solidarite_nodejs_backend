const express = require('express')
const router = express.Router()
const contratCtrl = require('../controllers/contrat.controller')

router.post('/', contratCtrl.createContrat)

module.exports = router