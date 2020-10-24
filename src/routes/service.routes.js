const express = require('express')
const router = express.Router()
const serviceCtrl = require('../controllers/service.controller')
const multer = require('../middlewares/multer.config')

router.post('/',multer, serviceCtrl.createService)
router.get('/', serviceCtrl.getServices)

module.exports = router