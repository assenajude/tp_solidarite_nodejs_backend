const db = require('../../db/models/index');
const Ville = db.Ville;
const Localisation = db.Localisation
const Location = db.Location

const createLocalisation = async (req, res, next) => {
    const data = {
        quartier: req.body.quartier,
        adresse: req.body.adresse
    }
    try {
        const ville = await Ville.findByPk(req.body.villeId)
        if(!ville)res.status(404).send({message: "ville introuvable pour ajouter la localisation"})
        let localisation;
        if(req.body.localisationId) {
            localisation = await Localisation.findByPk(req.body.localisationId)
            if(!localisation) res.status(404).send({message: "localisation introuvable"})
            await localisation.update(data)
        }else {
            localisation = await Localisation.create(data)
        }
        await localisation.setVille(ville)
        const justUpdated = await Localisation.findByPk(localisation.id, {
            include: [Ville,Location]
        })
        return res.status(201).send(justUpdated)
    }catch (e) {
        next(e)
    }
}

const deleteLocalisation = async (req, res, next) => {
    try {
        const selectedLocalisation = await Localisation.findByPk(req.body.localisationId)
        if(!selectedLocalisation) res.status(404).send({message: "localisation introuvable"})
        const localisationLocations = selectedLocalisation.getLocations()
        if(localisationLocations.length >0) return res.status(401).send({message: "Vous ne pouvez supprimer cette localisation, elle contient des données"})
        await selectedLocalisation.destroy()
        return res.status(200).send({localisationId: req.body.localisationId})
    }catch (e) {
        next(e)
    }
}

const getAllLocalisations = async (req, res, next) => {
    try {
        const localisations = await Localisation.findAll({
            include:[Ville, Location]
        })
        return res.status(200).send(localisations)
    }catch (e) {
        next(e)
    }
}

module.exports = {
    createLocalisation,
    deleteLocalisation,
    getAllLocalisations
}