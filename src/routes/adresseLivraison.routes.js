const express = require('express');
const router = express.Router();
const adresseCtrl = require('../controllers/adresseLivraison.controller');

router.post('/', adresseCtrl.addAdresseLivraison);
router.get('/', adresseCtrl.getAllAdresse);

module.exports = router