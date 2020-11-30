const db = require('../../db/models');
const Article = db.Article;
const Categorie = db.Categorie;
const ProductOption = db.ProductOption


createArticle = async (req, res, next) => {
    const idCategorie = req.body.categorieId;
    let incrementArticle = 0
    let imagesTab = []
    if(req.files) {
        req.files.forEach(file => {
            const lienImage = `${req.protocol}://${req.get('host')}/images/${file.filename}`
            imagesTab.push(lienImage)
        })
    }
    const newArticle = {
        designArticle: req.body.designation,
        qteStock: req.body.quantite,
        prixReel: req.body.prixReel,
        prixPromo: req.body.prixPromo,
        imagesArticle: imagesTab,
        aide: req.body.aide,
        descripArticle: req.body.description
    };
    try {
        let categorie = await Categorie.findByPk(idCategorie);
        if (!categorie) return res.status(404).send(`la categorie d'id ${idCategorie} n'a pas été trouvé`);
        let article = await Article.create(newArticle);
        await article.setCategorie(categorie)
        const allArticles = await Article.findAll()
        incrementArticle = allArticles.length
        article.codeArticle = `ART000${incrementArticle}`
        await article.save()
          const newAdded = await Article.findOne({
              where: {id: article.id},
              include: [Categorie, ProductOption]
          })
       return res.status(201).send(newAdded)
    } catch (e) {
        next(e)
    }
};

getAllArticles = async (req, res, next) => {
    try {
        const articles = await Article.findAll({
            include: [Categorie, ProductOption]
        });
        res.status(200).send(articles)
    } catch (e) {
        next(e)
    }
};

getOneArticle = async (req, res, next) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (!article) return res.status(404).send(`l'article d'id ${req.params.id} n'a pas été trouvé`)
        return res.status(200).send(article)
    } catch (e) {
        next(e)
    }
}

editArticle = async (req, res, next) => {
    const articleId = req.body.articleId
    const categorieId = req.body.categorieId
    try {
        const categorie = await Categorie.findByPk(categorieId)
        if(!categorie) return res.status(404).send('categorie introuvable')
        let article = await Article.findByPk(articleId)
        if(!article) return res.status(404).send('article introuvable')
        const updatedArticle = await article.update({
            designArticle: req.body.designation,
            qteStock: req.body.quantite,
            prixReel: req.body.prixReel,
            prixPromo: req.body.prixPromo,
            imagesArticle: images,
            aide: req.body.aide,
            descripArticle: req.body.description
        })
        await updatedArticle.setCategorie(categorie)
        return res.status(200).send(updatedArticle)
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createArticle,
    getAllArticles,
    getOneArticle,
    editArticle
}