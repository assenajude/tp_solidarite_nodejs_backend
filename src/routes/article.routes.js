const express = require('express');
const router = express.Router();

const articleCtrl = require('../controllers/article.controller');

router.post('/', articleCtrl.createArticle);
router.get('/', articleCtrl.getAllArticles);
router.get('/:id', articleCtrl.getOneArticle)
router.patch('/update', articleCtrl.editArticle)

module.exports = router;