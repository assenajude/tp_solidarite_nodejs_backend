const express = require('express')
const router = express.Router()
const token = require('../middlewares/auth.jwt')
const factureCtrl = require('../controllers/facture.controller')

router.post('/', factureCtrl.createFacture)
router.patch('/update',token.verifyToken, factureCtrl.updateFacture)
router.get('/byUser',token.verifyToken, factureCtrl.getUserFactures)
router.get('/', factureCtrl.getAllFacture)

module.exports = router