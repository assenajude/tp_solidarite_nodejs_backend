const express = require('express')
const router = express.Router()
const orderCtrl = require('../controllers/commande.controller')

router.post('/', orderCtrl.saveOrder)
router.get('/', orderCtrl.getAllOrder)

module.exports = router