const db = require('../../db/models')
const Espace = db.Espace

const createEspace = async (req, res, next) => {
    const data = {
        nom: req.body.nom,
        description: req.body.description
    }
    try {
        const newEspace = await Espace.create(data)
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

module.exports = {
    createEspace,
    getAllEspace
}