const express = require('express')
const router = express.Router()
const localisationCtrl = require('../controllers/localisation.controller')

router.post('/', localisationCtrl.createLocalisation)
router.delete('/deleteOne', localisationCtrl.deleteLocalisation)
router.get('/', localisationCtrl.getAllLocalisations)

module.exports = router