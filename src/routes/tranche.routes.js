const express = require('express')
const router = express.Router()
const trancheCtrl = require('../controllers/tranche.controller')

router.post('/', trancheCtrl.createTranche)
router.get('/', trancheCtrl.getAllTranches)
router.patch('/update',trancheCtrl.updateTranche)

module.exports = router