const db = require('../../db/models')
const Categorie = db.Categorie
const Service = db.Service
const dataSorter = require('../utilities/dataSorter')


createService = async (req, res, next) => {
    const idCategorie = req.body.categoryId;
    let incrementService = 0

    const serviceData = {
        libelle: req.body.libelle,
        description: req.body.description,
        imagesService: req.body.serviceImagesLinks,
        montantMin: req.body.montantMin,
        montantMax: req.body.montantMax,
        isDispo: req.body.isDispo
    }
    try {
        let categorie = await Categorie.findByPk(idCategorie);
        if (!categorie) return res.status(404).send(`la categorie d'id ${idCategorie} n'a pas été trouvé`);
        let service;
        if(req.body.serviceId) {
            service = await Service.findByPk(req.body.serviceId)
            if(!service) return res.status(404).send({message: "Service non trouvé"})
            await service.update(serviceData)
        }else {
            service = await Service.create(serviceData);
            const allServices = await Service.findAll()
            incrementService = allServices.length
            service.codeService = `SVC000${incrementService}`
            await service.save()
        }
        await service.setCategorie(categorie)
        const newService = await Service.findOne({
            where: {id: service.id},
            include: Categorie
        })
        return res.status(201).send(newService)
    } catch (e) {
            next(e)
    }
}


getServices = async (req, res, next) => {
    try{
        const services = await Service.findAll({
            include: Categorie
        })
        const sortedServices = dataSorter(services)
        res.status(200).send(sortedServices)
    } catch (e) {
        next(e)
    }
}

const deleteService = async (req, res, next) => {
    try{
        let selectedService = await Service.findByPk(req.body.id)
        if(!selectedService)return res.status(404).send({message: "Service non trouvé"})
        await selectedService.destroy()
        return res.status(200).send({serviceId: req.body.id})
    } catch (e) {
        next(e)
    }
}


module.exports = {
    createService,
    getServices,
    deleteService
}