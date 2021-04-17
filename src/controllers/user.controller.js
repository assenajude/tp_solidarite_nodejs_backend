
const db = require('../../db/models')
const User = db.User
const Article = db.Article
const Location = db.Location
const Categorie = db.Categorie
const decoder = require('jwt-decode')


updateProfile = async (req, res, next) => {
    try {

        const registeredUser = await User.findByPk(req.body.userId)
        if(!registeredUser) return res.status(404).send(`L'utilisateur d'id ${req.body.userId} n'existe pas`)

            registeredUser.username = req.body.username
            registeredUser.email = req.body.email
            registeredUser.nom = req.body.nom
            registeredUser.prenom = req.body.prenom
            registeredUser.phone = req.body.phone
            registeredUser.adresse = req.body.adresse
            registeredUser.profession = req.body.profession
            registeredUser.domaine = req.body.domaine
            registeredUser.statusEmploi = req.body.statusEmploi

        const newEdited = await registeredUser.save()
        res.status(200).send(newEdited)

    } catch (e) {
        next(e.message)
    }

}

addUserAvatar = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    try {
        let currentUser = await User.findByPk(user.id)
        if(!currentUser) return res.status(404).send(`L'utilisateur d'id ${user.id} n'existe pas`)
        currentUser.avatar = req.body.avatarUrl
        await currentUser.save()
        return res.status(200).send({avatar: currentUser.avatar})
    } catch (e) {
        next(e)
    }
}

const getUserProfileAvatar = async (req, res, next) => {
    try {
        const userToken = req.headers['x-access-token']
        const connectedUser = decoder(userToken)
        const user = await User.findByPk(connectedUser.id)
        if(!user || !user.avatar || user.avatar === '') return res.status(200).send({avatar: null})
        return res.status(200).send({avatar:user.avatar})
    } catch (e) {
        next(e)
    }
}

addUserPiece = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.body.userId)
        if(!user) return res.status(404).send(`L'utilisateur d'id ${req.body.userId} n'existe pas`)
        user.pieceIdentite = req.body.piecesUrlArray
        await user.save()
        return res.status(200).send(user.pieceIdentite)
    } catch (e) {
        next(e.message)
    }
}


getConnectedUserData = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    try {
        const connectedUser = await User.findByPk(user.id, {
            attributes: {exclude: ['password']}
        })
        if(!connectedUser) return res.status(404).send('Utilisateur non trouvé')
        return res.status(200).send(connectedUser)
    } catch (e) {
        next(e.message)
    }
}

const getUserFavoris = async (req,res,next) => {
    const token = req.headers['x-access-token']
    if(!token) return res.status(400).send('Aucun token trouvé')
     const connectedUser = decoder(token)
    try {
        const user = await User.findByPk(connectedUser.id)
        if(!user) return res.status(404).send('Utilisateur introuvable')
        const articlesFav = await user.getArticles()
        const locationsFav = await user.getLocations()
        return res.status(200).send({articleFavoris: articlesFav, locationFavoris: locationsFav})
    } catch (e) {
        next(e)
    }
}


toggleUserFavoris = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const connectedUser = decoder(token)
    try {
        let user = await User.findByPk(connectedUser.id)
        const product = req.body
        let selected;
        const productKeys = Object.keys(product)
        let typeRequest;
        if(productKeys.indexOf('Categorie') !== -1) {
            typeRequest = product.Categorie.typeCateg
        } else typeRequest = product.type

        if(typeRequest === 'article') {
            const userFavoris = await user.getArticles()
            if(userFavoris.some(item => item.id === product.id)) {
                await user.removeArticle(product.id)
            } else {
               await user.addArticle(product.id)
                user.favoriteCompter += 1
            }
         selected = await Article.findByPk(product.id, {
             include: Categorie
         })
        } else {
            const userLocationFavoris = await user.getLocations()
            if(userLocationFavoris.some(item => item.id === product.id)) {
                await user.removeLocation(product.id)
            } else {
               await user.addLocation(product.id)
                user.favoriteCompter += 1

            }
        selected = await Location.findByPk(product.id, {
            include: Categorie
        })
        }
        await user.save()
        return res.status(200).send(selected)
    } catch (e) {
        next(e.message)
    }

}

const resetCompter = async (req, res, next) => {
    try {
        let user  = await User.findByPk(req.body.userId)
        if(req.body.helpCompter) user.helpCompter = 0
        if(req.body.messageCompter) user.messageCompter -= 1
        if(req.body.favoriteCompter) user.favoriteCompter = 0
        if(req.body.factureCompter) user.factureCompter = 0
        if(req.body.articleCompter) user.articleCompter = 0
        if(req.body.locationCompter) user.locationCompter = 0
        if(req.body.serviceCompter) user.serviceCompter = 0
        if(req.body.propositionCompter) user.propositionCompter = 0
        if(req.body.parrainageCompter) user.parrainageCompter -= 1
        await user.save()
        const updatedUser = await User.findByPk(user.id, {
            attributes:{exclude: ['password']}
        })
        return res.status(200).send(updatedUser)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    updateProfile,
    addUserAvatar,
    addUserPiece,
    getUserProfileAvatar,
    getConnectedUserData,
    getUserFavoris,
    toggleUserFavoris,
    resetCompter
}