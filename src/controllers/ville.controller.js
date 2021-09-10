const db = require('../../db/models');
const Region = db.Region;
const Ville = db.Ville
const Relais = db.PointRelais

const addVille = async (req, res, next) => {
    const idRegion = req.body.regionId;
    const data = {
        nom: req.body.nom,
        localisation: req.body.localisation,
        kilometrage: req.body.kilometrage,
        prixKilo: req.body.prixKilo
    }

    try {
        const region = await Region.findByPk(idRegion)
        if(!region) return res.status(404).send(`la region d'id ${idRegion} n'existe pas`)
        let newVille;
        if(req.body.id) {
            newVille = await Ville.findByPk(req.body.id)
            if(!newVille) return res.status(404).send({message: 'ville non trouvé'})
            await newVille.update(data)
        }else  {
            newVille = await Ville.create(data)
        }
        await newVille.setRegion(region)
        return res.status(201).send(newVille)
    } catch (e) {
        next(e)
    }
};

getAllVilles = async (req, res, next) => {
    try{
        const villes = await Ville.findAll({
            include: [Relais, Region]
        });
        return res.status(200).send(villes)
    } catch (e) {
        next(e)
    }
}


const deleteVille = async (req, res, next) => {
    try{
        let selectedVille = await Ville.findByPk(req.body.villeId)
        if(!selectedVille) return res.status(404).send({message: 'Ville non trouvée'})
        const villesRelais = await selectedVille.getPointRelais()
        if(villesRelais.length>0) return res.status(401).send({message: 'vous netes autorisés à supprimer cette ville'})
        await selectedVille.destroy()
        return res.status(200).send({villeId: req.body.villeId})
    }catch (e) {
        next(e)
    }
}

module.exports = {
    addVille,
    getAllVilles,
    deleteVille
}