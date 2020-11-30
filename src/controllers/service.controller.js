const db = require('../../db/models')
const Categorie = db.Categorie
const Service = db.Service

const createService = async (req, res, next) => {
    try{
        let categorie = await Categorie.findByPk(req.body.categoryId)
        if(!categorie) return res.status(404).send(`La categorie d'id ${req.body.categoryId} n'existe pas`)
        let imagesTab = []
        if (req.files) {
            req.files.forEach(file => {
            const image = `${req.protocol}://${req.get('host')}/images/${file.filename}`
                imagesTab.push(image)
            })
        }
        let newService = await Service.create({
            libelle: req.body.libelle,
            description: req.body.description,
            imagesService: imagesTab,
            montantMin: req.body.montantMin,
            montantMax: req.body.montantMax,
            isDispo: req.body.isDispo
        })
        await newService.setCategorie(categorie)

        const allServices = await Service.findAll()
        const serviceLength = allServices.length
        newService.codeService = `SVC000${serviceLength}`
        await newService.save()
        const newAdded = await Service.findOne({
            where: {id: newService.id},
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