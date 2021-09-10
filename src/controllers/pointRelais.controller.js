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
       let pointRelais;
           if(req.body.id) {
               pointRelais = await PointRelais.findByPk(req.body.id)
               if(!pointRelais) return res.status(401).send({message: 'Point relais non trouvé'})
               await pointRelais.update(newPoint)
           }else{
           pointRelais = await PointRelais.create(newPoint);
           }
        await pointRelais.setVille(ville)
        const justAdded = await PointRelais.findByPk(pointRelais.id, {
            include: Ville
        })
        res.status(200).send(justAdded)
    } catch (e) {
        next(e)
    }
};

const getAllPoint = async (req, res, next) => {
    try {
        const allPoints = await PointRelais.findAll({
            include: Ville
        });
        return res.status(200).send(allPoints)
    } catch (e) {
        next(e)
    }
}

const deleteRelais =async (req, res, next) => {
    try {
        let selectedRelais = await PointRelais.findByPk(req.body.relaisId)
        if(!selectedRelais) return res.status(404).send({message: "point relais non trouvé"})
        const relaisAdresse = await selectedRelais.getUserAdresses()
        if(relaisAdresse && relaisAdresse.length>0) return res.status(401).send({message: 'vous ne pouvez pas supprimer ce point relais.'})
        await selectedRelais.destroy()
        return res.status(200).send({relaisId: req.body.relaisId})
    }catch (e) {
        next(e)
    }
}

module.exports = {
    addPointRelais,
    getAllPoint,
    deleteRelais

}