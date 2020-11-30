const db = require('../../db/models/index')
const Couleur = db.Couleur
const Taille = db.Taille

const addCouleur = async (req, res, next) => {
    try {
        const newColor = await Couleur.create({
            name: req.body.couleur
        })
        return res.status(201).send({couleur: newColor})
    } catch (e) {
        next(e)
    }
}

const addTaille = async (req, res, next) => {
    try {
        const newTaille = await Taille.create({
            name: req.body.taille
        })

        return res.status(201).send({taille: newTaille})
    } catch (e) {
        next(e)
    }
}

getColorAndSize = async (req, res, next) => {
    try {
        const colors = await Couleur.findAll()
        const tailles = await Taille.findAll()
        return res.status(200).send({couleurs: colors, tailles})
    } catch (e) {
        next(e)
    }
}


module.exports = {
    addCouleur,
    addTaille,
    getColorAndSize
}