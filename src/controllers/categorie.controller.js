const db = require('../../db/models');
const Espace = db.Espace
const Categorie = db.Categorie;


createCategorie = async (req, res, next) => {
    const newCategorie = {
        libelleCateg: req.body.libelle,
        descripCateg: req.body.description,
        imageCateg: req.body.categImagesLinks[0]
    };
    try {
        let selectedEspace = await Espace.findByPk(req.body.idEspace)
        if(!selectedEspace) return res.status(404).send('Vous devez choisir un espace pour ajouter une categorie')
        let categorie = await selectedEspace.createCategorie(newCategorie);
        let type = ''
        if(selectedEspace.nom === 'e-commerce') {
            type = 'article'
        } else if(selectedEspace.nom === 'e-location'){
            type = 'location'
        } else {
            type = 'service'
        }
        categorie.typeCateg = type
        await categorie.save()
       return  res.status(201).send(categorie)
    } catch (e) {
        next(e.message)
    }

};




getAllCategories = async (req, res, next) => {
    try {
        const categories = await Categorie.findAll()
        return res.status(200).send(categories);
    }catch(error) {
        next(error)
    }
}

const getEspaceCategorie = async (req, res, next) => {
    const idEspace = req.body.idEspace
    try {
        const selectedEspace = await Espace.findByPk(idEspace)
        if(!selectedEspace) return res.status(404).send('Veuillez choisir un espace')
        const categoriesEspace = await selectedEspace.getCategories()
        return res.status(200).send(categoriesEspace)
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    createCategorie,
    getAllCategories,
    getEspaceCategorie
}