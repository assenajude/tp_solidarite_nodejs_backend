const db = require('../models/index')
const Categorie = db.categorie
const Service = db.service

const createService = async (req, res, next) => {
    let image = ''
    try{
        let categorie = await Categorie.findByPk(req.body.categoryId)
        if(!categorie) return res.status(404).send(`La categorie d'id ${req.body.categoryId} n'existe pas`)
        if (req.file) {
            image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        const newService = await categorie.createService({
            libelle: req.body.libelle,
            description: req.body.description,
            imageService: image,
            montantMin: req.body.montantMin,
            montantMax: req.body.montantMax
        })
        const added = await newService.reload()
        const newAdded = await Service.findByPk(added.id, {
            include: Categorie
        })
        return res.status(201).send(newAdded)
    } catch (e) {
        next(e.message)
    }
}


const getServices = async (req, res, next) => {
    try{
        const services = await Service.findAll({
            include: Categorie
        })
        res.status(200).send(services)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    createService,
    getServices
}