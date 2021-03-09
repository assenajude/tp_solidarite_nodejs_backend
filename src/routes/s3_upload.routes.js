const express = require('express')
const router = express.Router()
const s3Ctrl = require('../controllers/s3_upload.controller')

router.post('/s3_upload', s3Ctrl.getUploadSignature)

module.exports = router