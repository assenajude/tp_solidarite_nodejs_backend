const db = require('../models/index')
const Article = db.article;
const Location = db.location
const Categorie = db.categorie

getAllData = async (req, res, next) => {
    try{
        const articles = await Article.findAll({
            include: Categorie
        })

        const locations = await Location.findAll({
            include: Categorie
        })

        const allData = articles.concat(locations)
        allData.sort((a, b) => {
            if(b.createdAt < a.createdAt ) return -1
            if (b.createdAt > a.createdAt) return 1
            return 0;

        })
        return res.status(200).send(allData)

    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    getAllData
}