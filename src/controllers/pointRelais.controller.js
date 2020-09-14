const db  = require('../models/index');
const PointRelais = db.pointRelais;
const Region = db.ville;

const addPointRelais = async (req, res, next) => {
    const idVille  = req.body.villeId;
    const newPoint = {
        nom: req.body.nom,
        contact: req.body.contact,
        adresse: req.body.adresse,
        email: req.body.email
    }
    try {
        let ville = await Region.findByPk(idVille);
        if (!ville) return res.status(404).send(`la ville choisie n'existe pas `)
       const pointRelais = await PointRelais.create(newPoint);
        await pointRelais.setVille(ville)
        res.status(201).send(pointRelais)
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