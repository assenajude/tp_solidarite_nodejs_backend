const express = require('express');
const router = express.Router();
const villeCtrl  = require('../controllers/ville.controller')
const {isAdmin, verifyToken} = require('../middlewares/auth.jwt')


router.post('/', [verifyToken, isAdmin],villeCtrl.addVille)
router.get('/', villeCtrl.getAllVilles)

module.exports = router