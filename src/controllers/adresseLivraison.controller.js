const db = require('../models');
const AdresseLivraison = db.adresseLivraison;
const PointRelais = db.pointRelais

const addAdresseLivraison = async (req, res, next) => {
/*    const newAdresse = {
        region: req.body.region,
        ville: req.body.ville ,
        distance: req.body.distance,
        coutLivraison: req.body.cout
    }*/
    const newAdresse = {
        ...req.body
    }
    try {
        const adresse = await AdresseLivraison.create(newAdresse);
        return  res.status(201).send(adresse)
    } catch (e) {
        next(e.message)
    }
};


const getAllAdresse = async (req, res, next) => {
    try {
        const adresses = await AdresseLivraison.findAll({
            include: PointRelais
        });
        res.status(200).send(adresses)
    } catch (e) {
        next(e.message)
    }
};

module.exports = {
    addAdresseLivraison,
    getAllAdresse
}
