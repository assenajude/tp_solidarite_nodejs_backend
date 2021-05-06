const express = require('express')
const router = express.Router()
const userToken = require('../middlewares/auth.jwt')
const compteParrainCtrl = require('../controllers/compteParrainage.controller')

router.post('/',userToken.verifyToken,compteParrainCtrl.createCompteParrainage )
router.post('/allComptes',compteParrainCtrl.getAllParrainCompte)
router.patch('/parrainageRequest', compteParrainCtrl.sendParrainageRequest)
router.patch('/parrainageResponse', compteParrainCtrl.respondToParrainageMessage)
router.patch('/manageParrainage', compteParrainCtrl.getParrainageManaged)
router.post('/parrainageData',userToken.verifyToken,compteParrainCtrl.getUserParrainageData)
router.patch('/editInitial',userToken.verifyToken, compteParrainCtrl.editInitialFund)
router.patch('/editQuotite',userToken.verifyToken, compteParrainCtrl.editQuotiteFund)
router.post('/userCompte',userToken.verifyToken, compteParrainCtrl.getUserCompte)
router.post('/userCompte',userToken.verifyToken, compteParrainCtrl.getUserCompte)

module.exports = router