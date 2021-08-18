const db = require('../../db/models')
const Espace = db.Espace

const createEspace = async (req, res, next) => {
    const data = {
        nom: req.body.nom,
        description: req.body.description
    }
    try {
        let newEspace;
        if(req.body.espaceId) {
            newEspace = await Espace.findByPk(req.body.espaceId)
            if(!newEspace) return res.status(404).send({message: 'aucun espace trouvé'})
            await newEspace.update(data)
        }else {
            newEspace  = await Espace.create(data)
        }
        return res.status(201).send(newEspace)
    } catch (e) {
        next(e.message)
    }
}

const getAllEspace = async (req, res, next) => {
    try {
    const allEspace = await Espace.findAll()
        return res.status(200).send(allEspace)
    } catch (e) {
        next(e.message)
    }
}

const deleteEspace = async (req, res, next) => {
    console.log('deleting espace..............................;', req.body)
    try {
        const selectedEspace = await Espace.findByPk(req.body.espaceId)
        if(!selectedEspace) return res.status(404).send({message: "espace non trouvé"})
        const espaceCategories = await selectedEspace.getCategories()
        if(espaceCategories.length>0) {
            return res.status(401).send({message: 'Vous ne pouvez pas supprimer cet espace ayant du contenu.'})
        }
        await selectedEspace.destroy()
        return res.status(200).send({espaceId: req.body.espaceId})
    }catch (e) {
        next(e)
    }
}

module.exports = {
    createEspace,
    getAllEspace,
    deleteEspace
}