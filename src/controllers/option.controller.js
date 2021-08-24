const db = require('../../db/models/index')
const Location = db.Location
const Article = db.Article

const addOption = async (req,res,next) => {
    const data = {
        couleur: req.body.couleur? req.body.couleur : '',
        taille: req.body.taille?req.body.taille: '',
        modele: req.body.modele?req.body.modele : '',
    }
    let updated;
    try {
        if(req.body.type=== 'article') {
            updated = await Article.findByPk(req.body.itemId)
            await updated.createProductOption(data, {
                through: {
                    quantite: Number(req.body.quantite)>0? Number(req.body.quantite): updated.qteStock,
                    prix: Number(req.body.prix)>0? Number(req.body.prix) : updated.prixPromo
                }
            })
        } else  if(req.body.type ==='location') {
            updated = await Location.findByPk(req.body.itemId)
            await updated.createProductOption(data, {
                through: {
                    quantite: Number(req.body.quantite)>0? Number(req.body.quantite): updated.qteStock,
                    prix: Number(req.body.prix)>0? Number(req.body.prix) : updated.prixPromo
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