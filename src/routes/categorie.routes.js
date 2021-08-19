const express = require('express');
const router = express.Router();
const {isAdmin, verifyToken} = require('../middlewares/auth.jwt')
const categorieCtrl = require('../controllers/categorie.controller');

router.post('/',[verifyToken, isAdmin], categorieCtrl.createCategorie);
router.get('/', categorieCtrl.getAllCategories);
router.get('/espace', categorieCtrl.getEspaceCategorie)
router.delete('/deleteOne',[verifyToken, isAdmin], categorieCtrl.deleteCategorie)

module.exports = router