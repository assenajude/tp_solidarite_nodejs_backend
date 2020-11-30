const db = require('../../db/models/index')
const Location = db.Location
const Article = db.Article
const Couleur = db.Couleur
const Taille = db.Taille
const ProductOption = db.ProductOption

const addOption = async (req,res,next) => {
    const data = {
        couleur: req.body.couleur,
        taille: req.body.taille,
        modele: req.body.modele
    }
    let updated;
    try {
        if(req.body.type=== 'e-commerce') {
            updated = await Article.findByPk(req.body.itemId)
            await updated.createProductOption(data, {
                through: {
                    quantite: req.body.quantite,
                    prix: req.body.prix
                }
            })
        } else  if(req.body.type ==='e-location') {
            updated = await Location.findByPk(req.body.itemId)
            updated.createProductOption(data, {
                through: {
                    quantite: req.body.quantite,
                    prix: req.body.prix
                }
            })
        }
        return res.status(201).send(updated)
    } catch (e) {
        next(e)
    }
}


module.exports = {
    addOption
}