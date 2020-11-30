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
    const transaction = await db.sequelize.transaction()
    try {
        let ville = await Ville.findByPk(idVille, {transaction});
        if (!ville) return res.status(404).send(`la ville choisie n'existe pas `)
       const pointRelais = await PointRelais.create(newPoint, {transaction});
        await pointRelais.setVille(ville, {transaction})
        await transaction.commit()
        res.status(201).send(pointRelais)
    } catch (e) {
        await transaction.rollback()
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