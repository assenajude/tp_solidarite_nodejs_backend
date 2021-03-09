const express = require('express');
const router = express.Router();
const multerConfig = require('../middlewares/multer.config')
const isAdmin = require('../middlewares/auth.jwt')

const categorieCtrl = require('../controllers/categorie.controller');

router.post('/',  multerConfig ,categorieCtrl.createCategorie);
router.get('/', categorieCtrl.getAllCategories);
router.get('/espace', categorieCtrl.getEspaceCategorie)

module.exports = router