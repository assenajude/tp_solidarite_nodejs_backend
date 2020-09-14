const db = require('../models/index');
const Article = db.article;
const Categorie = db.categorie;

createArticle = async (req, res, next) => {
    const idCategorie = req.body.categorieId;
    let lienImage = '';
    if(req.file) {
        lienImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    const newArticle = {
        codeArticle: req.body.code,
        designArticle: req.body.designation,
        qteStock: req.body.quantite,
        prixReel: req.body.prixReel,
        prixPromo: req.body.prixPromo,
        imageArticle: lienImage,
        aide: req.body.aide,
        descripArticle: req.body.description
    };
    try {
        let categorie = await Categorie.findByPk(idCategorie);
        if (!categorie) return res.status(404).send(`la categorie d'id ${idCategorie} n'a pas été trouvé`);
        const article = await categorie.createArticle(newArticle);
        res.status(201).send(article)
    } catch (e) {
        next(e)
    }
};

getAllArticles = async (req, res, next) => {
    try {
        const articles = await Article.findAll();
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

module.exports = {
    createArticle,
    getAllArticles,
    getOneArticle
}