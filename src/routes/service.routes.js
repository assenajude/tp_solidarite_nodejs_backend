const express = require('express')
const router = express.Router()
const serviceCtrl = require('../controllers/service.controller')

router.post('/',serviceCtrl.createService)
router.get('/', serviceCtrl.getServices)
router.delete('/deleteOne', serviceCtrl.deleteService)

module.exports = router