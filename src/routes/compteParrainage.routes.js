const express = require('express')
const router = express.Router()
const userToken = require('../middlewares/auth.jwt')
const compteParrainCtrl = require('../controllers/compteParrainage.controller')

router.post('/',userToken.verifyToken,compteParrainCtrl.createCompteParrainage )
router.get('/',compteParrainCtrl.getAllParrainCompte)
router.post('/parrainageOrders',compteParrainCtrl.getParrainageOrders)
router.patch('/parrainageResponse', compteParrainCtrl.respondToParrainageMessage)
router.patch('/stopParrainage', compteParrainCtrl.getParrainageStopped)
router.post('/parrainageData',userToken.verifyToken,compteParrainCtrl.getUserParrainageData)
router.patch('/editInitial',userToken.verifyToken, compteParrainCtrl.editInitialFund)
router.patch('/editQuotite',userToken.verifyToken, compteParrainCtrl.editQuotiteFund)
router.post('/userCompte',userToken.verifyToken, compteParrainCtrl.getUserCompte)
router.patch('/activeCompte',[userToken.verifyToken, userToken.isAdmin], compteParrainCtrl.activeParrainCompte)

module.exports = router