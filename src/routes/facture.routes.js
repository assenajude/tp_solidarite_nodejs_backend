const express = require('express')
const router = express.Router()
const token = require('../middlewares/auth.jwt')
const factureCtrl = require('../controllers/facture.controller')

router.post('/', factureCtrl.createFacture)
router.get('/', factureCtrl.getAllFactures)
router.patch('/update',token.verifyToken, factureCtrl.updateFacture)
router.get('/byUser',token.verifyToken, factureCtrl.getUserFactures)

module.exports = router