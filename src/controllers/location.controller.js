const db = require('../../db/models/index');
const Categorie = db.Categorie;
const Location = db.Location
const ProductOption = db.ProductOption
const Localisation = db.Localisation
const dataSorter = require('../utilities/dataSorter')

addNewLocation = async (req, res, next) => {
    const idCategorie = req.body.categoryId
    let locationLength = 0

    const newLocation = {
        libelleLocation: req.body.libelle,
        descripLocation: req.body.description,
        adresseLocation: req.body.adresse,
        coutPromo: req.body.coutPromo,
        coutReel: req.body.coutReel,
        frequenceLocation: req.body.frequence,
        imagesLocation: req.body.locationImagesLinks,
        debutLocation: req.body.debut,
        finLocation: req.body.fin,
        nombreCaution: req.body.caution,
        nombrePretendant: req.body.pretendant,
        qteDispo: req.body.dispo,
        aide: req.body.aide

    };
    try {
        const categorie = await Categorie.findByPk(idCategorie);
        if (!categorie) return res.status(404).send(`La categorie d'id ${idCategorie} n'existe pas`)
        const localisation = await Localisation.findByPk(req.body.localisationId)
        if(!localisation) return res.status(404).send({message: 'La localisation est introuvable.'})
        let location;
        if(req.body.locationId) {
            location = await Location.findByPk(req.body.locationId)
            await location.update(newLocation)
        }else{
        location = await Location.create(newLocation);
        const allLocation = await Location.findAll()
        locationLength = allLocation.length
        location.codeLocation = `LOC000${locationLength}`
        await location.save()
        }
        await location.setCategorie(categorie)
        await location.setLocalisation(localisation)
        const newAdded = await Location.findByPk(location.id,{
            include: [Categorie, ProductOption, Localisation]
        })
      return res.status(201).send(newAdded)
    } catch (e) {
        next (e)
    }
};

getAllLocations = async (req, res, next) => {
    try{
        const locations = await Location.findAll({
            include: [Categorie,Localisation, ProductOption]
        })
        const sortedLocations = dataSorter(locations)
        return res.status(200).send(sortedLocations)
    } catch (e) {
      next(e)
    }
}

const deleteLocation = async (req, res, next) => {
    try {
        let selectedLocation = await Location.findByPk(req.body.locationId)
        if(!selectedLocation)return res.status(404).send({message: "Location non trouvée"})
        await selectedLocation.destroy()
        return res.status(200).send({locationId: req.body.locationId})
    } catch (e) {
        next(e)
    }
}

module.exports = {
    addNewLocation,
    getAllLocations,
    deleteLocation
}