const db = require('../models/index');
const Categorie = db.categorie;

createCategorie = async (req, res, next) => {
    const newCategorie = {
        libelleCateg: req.body.libelle,
        descripCateg: req.body.description,
        typeCateg: req.body.type
    };
    try {
        const categorie = await Categorie.create(newCategorie);
        res.status(201).send(categorie)
    } catch (e) {
        next(e.message)
    }

};


getAllCategories = async (req, res, next) => {
    try {
    const categories = await Categorie.findAll();
     res.status(200).send(categories);
    }catch(error) {
        next(error)
    }

}


module.exports = {
    createCategorie,
    getAllCategories
}