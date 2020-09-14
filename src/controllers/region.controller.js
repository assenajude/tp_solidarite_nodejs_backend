const db = require('../models/index');
const Region = db.region;
const Ville = db.ville

const addRegion  = async (req, res, next) => {
    try {
    const newRegion = await Region.create({
        nom: req.body.nom,
        localisation: req.body.localisation
    });
    return res.status(201).send(newRegion)
    } catch (e) {
        next(e.message)
    }
};

getAllRegions = async (req, res, next) => {
    try {
        const regions = await Region.findAll({
            include: Ville
        })
        return res.status(200).send(regions)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    addRegion,
    getAllRegions
}