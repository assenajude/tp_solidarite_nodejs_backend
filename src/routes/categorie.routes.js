const express = require('express');
const router = express.Router();

const categorieCtrl = require('../controllers/categorie.controller');

router.post('/',categorieCtrl.createCategorie);
router.get('/', categorieCtrl.getAllCategories);
router.get('/espace', categorieCtrl.getEspaceCategorie)

module.exports = router