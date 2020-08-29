const db  = require('../models');
const PointRelais = db.pointRelais;
const AdresseLivraison = db.adresseLivraison;

const addPointRelais = async (req, res, next) => {
    const idAdLivraison = req.body.adresseLivraisonId;
    const newPoint = {
        nom: req.body.nom,
        contact: req.body.contact,
        adresse: req.body.adresse,
        email: req.body.email
    }

    try {
        let adLivraison = await AdresseLivraison.findByPk(idAdLivraison);
        if (!adLivraison) return res.status(404).send(`l'adresse de livraison d'id ${idAdLivraison} n'existe pas`)
        const point = adLivraison.createPointRelais(newPoint);
       return  res.satus(201).send(point)
    } catch (e) {
        next(e.message)
    }
};

const getAllPoint = async (req, res, next) => {
    try {
        const allPoints = await PointRelais.findAll();
        return res.status(200).send(allPoints)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    addPointRelais,
    getAllPoint
}