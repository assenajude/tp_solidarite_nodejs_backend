const express = require('express');
const router = express.Router();
const villeCtrl  = require('../controllers/ville.controller')

router.post('/',villeCtrl.addVille)
router.get('/', villeCtrl.getAllVilles)

module.exports = router