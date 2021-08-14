const db  = require('../../db/models/index');
const PointRelais = db.PointRelais;
const Ville = db.Ville;

const addPointRelais = async (req, res, next) => {
    const idVille  = req.body.villeId;
    const newPoint = {
        nom: req.body.nom,
        contact: req.body.contact,
        adresse: req.body.adresse,
        email: req.body.email
    }
    try {
        const ville = await Ville.findByPk(idVille);
        if (!ville) return res.status(404).send(`la ville choisie n'existe pas `)
       let pointRelais = await PointRelais.create(newPoint);
        await pointRelais.setVille(ville)
        res.status(201).send(pointRelais)
    } catch (e) {
        next(e.message)
    }
};

const getAllPoint = async (req, res, next) => {
    try {
        const allPoints = await PointRelais.findAll({
            include: Ville
        });
        return res.status(200).send(allPoints)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    addPointRelais,
    getAllPoint
}