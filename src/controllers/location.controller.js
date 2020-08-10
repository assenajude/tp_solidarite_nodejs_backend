const db = require('../models/index');
const Categorie = db.categorie;

createLocation = async (req, res, next) => {
    const idCategorie = req.body.categorieId;
    const newLocation = {
        codeLocation: req.body.code,
        libelleLocation: req.body.libelle,
        descripLocation: req.body.description,
        adresseLocation: req.body.adresse,
        coutLocation: req.body.cout,
        frequenceLocation: req.body.frequence,
        imageLocation: req.body.lienImage,
        debutLocation: req.body.debut,
        finLocation: req.body.fin

    };
    try {
        let categorie = await Categorie.findByPk(idCategorie);
        const location = await categorie.createLocation(newLocation);
        res.status(201).send(location)

    } catch (e) {
        next (e.message)
    }
};

module.exports = {
    createLocation
}