const db = require('../models/index');
const Categorie = db.categorie;
const Location = db.location

addNewLocation = async (req, res, next) => {
    let imageLocation = '';
    let locationLength = 0
    try {
    if(req.file) {
        imageLocation = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    const newLocation = {
        libelleLocation: req.body.libelle,
        descripLocation: req.body.description,
        adresseLocation: req.body.adresse,
        coutPromo: req.body.coutPromo,
        coutReel: req.body.coutReel,
        frequenceLocation: req.body.frequence,
        imageLocation: imageLocation,
        debutLocation: req.body.debut,
        finLocation: req.body.fin,
        nombreCaution: req.body.caution,
        nombrePretendant: req.body.pretendant,
        qteDispo: req.body.dispo,
        aide: req.body.aide

    };

        let categorie = await Categorie.findByPk(req.body.categoryId);
        if (!categorie) return res.status(404).send(`La categorie d'id ${idCategorie} n'existe pas`)
        const location = await categorie.createLocation(newLocation);
        const allLocation = await Location.findAll()
        locationLength = allLocation.length
        location.codeLocation = `LOC000${locationLength}`
        const newAdded = Location.findOne({
            where: {
                libelleLocation: req.body.libelle
            },
            include: [Categorie]
        })
        res.status(201).send(newAdded)
    } catch (e) {
        next (e.message)
    }
};

getAllLocations = async (req, res, next) => {
    try{
        const locations = await Location.findAll({
            include: Categorie
        })
        return res.status(200).send(locations)
    } catch (e) {
      next(e.message)
    }
}

module.exports = {
    addNewLocation,
    getAllLocations
}