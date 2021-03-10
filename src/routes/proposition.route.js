const express = require('express')
const router = express.Router()
const tokenVerify = require('../middlewares/auth.jwt')
const propositionCtrl = require('../controllers/proposition.controller')

router.post('/',[tokenVerify.verifyToken], propositionCtrl.newProposition)
router.patch('/update',[tokenVerify.verifyToken,tokenVerify.isAdmin], propositionCtrl.editProposition)
router.get('/', propositionCtrl.getAllProposition)

module.exports = router