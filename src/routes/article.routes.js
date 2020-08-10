const express = require('express');
const router = express.Router();
const multer = require('../middlewares/multer.config')

const articleCtrl = require('../controllers/article.controller');

router.post('/',multer, articleCtrl.createArticle);
router.get('/', articleCtrl.getAllArticles);
router.get('/:id', articleCtrl.getOneArticle)

module.exports = router;