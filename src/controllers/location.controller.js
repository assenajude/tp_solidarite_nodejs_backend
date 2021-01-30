const db = require('../../db/models/index');
const Categorie = db.Categorie;
const Location = db.Location
const ProductOption = db.ProductOption

addNewLocation = async (req, res, next) => {
    const idCategorie = req.body.categoryId
    let locationLength = 0
    let imagesTab = []
    if(req.files) {
        req.files.forEach(file => {
        const imageLocation = `${req.protocol}://${req.get('host')}/images/${file.filename}`
            imagesTab.push(imageLocation)
        })
    }
    const newLocation = {
        libelleLocation: req.body.libelle,
        descripLocation: req.body.description,
        adresseLocation: req.body.adresse,
        coutPromo: req.body.coutPromo,
        coutReel: req.body.coutReel,
        frequenceLocation: req.body.frequence,
        imagesLocation: imagesTab,
        debutLocation: req.body.debut,
        finLocation: req.body.fin,
        nombreCaution: req.body.caution,
        nombrePretendant: req.body.pretendant,
        qteDispo: req.body.dispo,
        aide: req.body.aide

    };
    // const transaction = await db.sequelize.transaction()
    try {
        let categorie = await Categorie.findByPk(idCategorie);
        if (!categorie) return res.status(404).send(`La categorie d'id ${idCategorie} n'existe pas`)
        let location = await Location.create(newLocation);
        await location.setCategorie(categorie)
        const allLocation = await Location.findAll()
        locationLength = allLocation.length
        location.codeLocation = `LOC000${locationLength}`
        await location.save()
        const newAdded = await Location.findByPk(location.id,{
            include: [Categorie, ProductOption]
        })
      return res.status(201).send(newAdded)
    } catch (e) {
        next (e.message)
    }
};

getAllLocations = async (req, res, next) => {
    try{
        const locations = await Location.findAll({
            include: [Categorie, ProductOption]
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