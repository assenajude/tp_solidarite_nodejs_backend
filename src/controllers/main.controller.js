const db = require('../../db/models')
const Article = db.Article;
const Location = db.Location
const Categorie = db.Categorie
const ProductOption = db.ProductOption

getAllData = async (req, res, next) => {
    try{
        const articles = await Article.findAll({
            include: [Categorie, ProductOption]
        })

        const locations = await Location.findAll({
            include: [Categorie, ProductOption]
        })

        const allData = articles.concat(locations)
        allData.sort((a, b) => {
            if(b.createdAt < a.createdAt ) return -1
            if (b.createdAt > a.createdAt) return 1
            return 0;
        })
        return res.status(200).send(allData)

    } catch (e) {
        next(e)
    }
}

const deleteItem = async (req, res, next) => {
    const currentItem = req.body
    let selectedItem;
    try {
        if(currentItem.Categorie.typeCateg === 'article') {
            selectedItem = await Article.findByPk(currentItem.id)
        } else {
            selectedItem = await Location.findByPk(currentItem.id)
        }
        await selectedItem.destroy()
        return res.status(200).send(currentItem)
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getAllData,
    deleteItem
}