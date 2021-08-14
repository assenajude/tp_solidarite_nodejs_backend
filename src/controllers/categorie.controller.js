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
        let categorie;
        if(req.body.categorieId) {
            categorie = await Categorie.findByPk(req.body.categorieId)
            await categorie.update(newCategorie)
        }else {
            categorie = await selectedEspace.createCategorie(newCategorie);
        }
        let type = ''
        if(selectedEspace.nom.toLowerCase() === 'e-commerce') {
            type = 'article'
        } else if(selectedEspace.nom.toLowerCase() === 'e-location'){
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

const deleteCategorie = async (req, res, next) => {
    try {
        let selectedCategorie = await Categorie.findByPk(req.body.categorieId)
        if(!selectedCategorie) return res.status(404).send({message: "categorie non trouvée"})
        const categorieArticles = await selectedCategorie.getArticles()
        const categorieLocations = await selectedCategorie.getLocations()
        const categorieServices = await selectedCategorie.getServices()
        const categorieProducts = [...categorieArticles, ...categorieLocations, ...categorieServices]
        if(categorieProducts.length>0) return res.status(403).send({message: "Vous ne pouvez pas supprimer cette categorie."})
        await selectedCategorie.destroy()
        return res.status(200).send({categorieId: req.body.categorieId})
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createCategorie,
    getAllCategories,
    getEspaceCategorie,
    deleteCategorie
}