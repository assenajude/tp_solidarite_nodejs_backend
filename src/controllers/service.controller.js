const db = require('../../db/models')
const Categorie = db.Categorie
const Service = db.Service

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
        let service = await Service.create(serviceData);
        await service.setCategorie(categorie)
        const allServices = await Service.findAll()
        incrementService = allServices.length
        service.codeService = `SVC000${incrementService}`
        await service.save()
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
        res.status(200).send(services)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    createService,
    getServices
}