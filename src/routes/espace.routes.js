const express = require('express')
const router = express.Router()
const espaceCtrl = require('../controllers/espace.controller')
const {isAdmin, verifyToken} = require('../middlewares/auth.jwt')

router.post('/',[verifyToken, isAdmin], espaceCtrl.createEspace)
router.get('/', espaceCtrl.getAllEspace)
router.delete('/deleteOne',[verifyToken, isAdmin], espaceCtrl.deleteEspace)

module.exports = router