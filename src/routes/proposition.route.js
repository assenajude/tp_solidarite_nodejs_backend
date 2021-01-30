const express = require('express')
const router = express.Router()
const multerConfig = require('../middlewares/multer.config')
const tokenVerify = require('../middlewares/auth.jwt')
const propositionCtrl = require('../controllers/proposition.controller')

router.post('/',[tokenVerify.verifyToken, multerConfig], propositionCtrl.newProposition)
router.patch('/update',[tokenVerify.verifyToken,tokenVerify.isAdmin, multerConfig], propositionCtrl.editProposition)
router.get('/', propositionCtrl.getAllProposition)

module.exports = router