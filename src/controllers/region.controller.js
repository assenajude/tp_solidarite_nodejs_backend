const db = require('../../db/models/index');
const Region = db.Region;
const Ville = db.Ville

const addRegion  = async (req, res, next) => {
    try {
        const data = {
            nom: req.body.nom,
            localisation: req.body.localisation
        }
        let newRegion;
        if(req.body.id) {
            newRegion = await Region.findByPk(req.body.id)
            await newRegion.update(data)
        }else {
            newRegion = await Region.create(data);
        }
    return res.status(201).send(newRegion)
    } catch (e) {
        next(e)
    }
};

getAllRegions = async (req, res, next) => {
    try {
        const regions = await Region.findAll({
            include: Ville
        })
        return res.status(200).send(regions)
    } catch (e) {
        next(e)
    }
}

const deleteRegion = async (req, res, next) => {
    try{
        let selectedRegion = await Region.findByPk(req.body.regionId)
        if(!selectedRegion) return res.status(404).send({message: "region non trouvé"})
        const regionVilles = await selectedRegion.getVilles()
        if(regionVilles.length>0) return res.status(401).send({message: "Vous nest pas autorisés à supprimer cette region"})
        await selectedRegion.destroy()
        return res.status(200).send({regionId: req.body.regionId})
    }catch (e) {
        next(e)
    }
}

module.exports = {
    addRegion,
    getAllRegions,
    deleteRegion
}