const db = require('../../db/models');
const Region = db.Region;
const Ville = db.Ville
const Relais = db.PointRelais

const addVille = async (req, res, next) => {
    const idRegion = req.body.regionId;

    try {
        const region = await Region.findByPk(idRegion)
        if(!region) return res.status(404).send(`la region d'id ${idRegion} n'existe pas`)
        const newVille = await region.createVille({
            nom: req.body.nom,
            localisation: req.body.localisation,
            kilometrage: req.body.kilometrage,
            prixKilo: req.body.prixKilo
        })
        return res.status(201).send(newVille)
    } catch (e) {
        next(e.message)
    }
};

getAllVilles = async (req, res, next) => {
    try{
        const villes = await Ville.findAll({
            include: Relais
        });
        return res.status(200).send(villes)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    addVille,
    getAllVilles
}