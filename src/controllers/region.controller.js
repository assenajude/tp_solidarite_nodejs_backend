const db = require('../../db/models/index');
const Region = db.Region;
const Ville = db.Ville

const addRegion  = async (req, res, next) => {
    const transaction = await db.sequelize.transaction()
    try {
    const newRegion = await Region.create({
        nom: req.body.nom,
        localisation: req.body.localisation
    }, {transaction});
    await transaction.commit()
    return res.status(201).send(newRegion)
    } catch (e) {
        await transaction.rollback()
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