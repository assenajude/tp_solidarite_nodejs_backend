
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

            registeredUser.username = req.body.username,
            registeredUser.email = req.body.email,
            registeredUser.nom = req.body.nom,
            registeredUser.prenom = req.body.prenom,
            registeredUser.phone = req.body.phone,
            registeredUser.adresse = req.body.adresse

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
        if (!req.files) {
            return res.status(400).send('Aucune image pour mettre a jour votre profil')
        }
        let lienAvatar;
        if(req.files.length === 0 ) {
            lienAvatar =''
        } else {
          lienAvatar = `${req.protocol}://${req.get('host')}/avatars/${req.files[0].filename}`
        }

        //const imageResize = await sharp(req.file.buffer).resize({width: 200, height: 200}).png().toBuffer()
        currentUser.avatar = lienAvatar
        const newUser = await currentUser.save()
        return res.status(200).send({avatar: newUser.avatar})
    } catch (e) {
        next(e)
    }
}

const getUserProfileAvatar = async (req, res, next) => {
    try {
        const userToken = req.headers['x-access-token']
        const connectedUser = decoder(userToken)
        const user = await User.findByPk(connectedUser.id)
        if(!user || !user.avatar) return res.status(404).send('utilisateur non trouvé')
        // res.set('Content-Type', 'image/png')
        return res.status(200).send({avatar:user.avatar})
    } catch (e) {

    }
}

addUserPiece = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.body.userId)
        if(!user) return res.status(404).send(`L'utilisateur d'id ${req.body.userId} n'existe pas`)
        if(!req.files) return res.status(400).send('Aucune image pour mettre a jour votre profil')
        const lienPiece = `${req.protocol}://${req.get('host')}/avatars/${req.files[0].filename}`
        // user.pieceIdentite = req.file.buffer
        user.pieceIdentite = lienPiece
        await user.save()
        return res.status(200).send('votre profil a été mis à jour avec succes')
    } catch (e) {
        next(e.message)
    }
}


getConnectedUserData = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    try {
        const connectedUser = await User.findByPk(user.id)
        if(!connectedUser) return res.status(404).send('Utilisateur non trouvé')
        return res.status(200).send(
            {
            username:connectedUser.username,
            email: connectedUser.email,
            nom: connectedUser.nom,
            prenom: connectedUser.prenom,
            phone: connectedUser.phone,
            adresse: connectedUser.adresse,
            avatar: connectedUser.avatar,
            pieceIdentite: connectedUser.pieceIdentite
        }
        )
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
        // const userFavoris = [...articlesFav, ...locationsFav]
        return res.status(200).send({articleFavoris: articlesFav, locationFavoris: locationsFav})
    } catch (e) {
        next(e)
    }
}


toggleUserFavoris = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const connectedUser = decoder(token)
    try {
        const user = await User.findByPk(connectedUser.id)
        const product = req.body
        let selected;
        const productKeys = Object.keys(product)
        let typeRequest;
        if(productKeys.indexOf('Categorie') !== -1) {
            typeRequest = product.Categorie.typeCateg
        } else typeRequest = product.type

        if(typeRequest === 'e-commerce') {
            const userFavoris = await user.getArticles()
            if(userFavoris.some(item => item.id === product.id)) {
                await user.removeArticle(product.id)
            } else {
               await user.addArticle(product.id)
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

            }
        selected = await Location.findByPk(product.id, {
            include: Categorie
        })
        }
        return res.status(200).send(selected)
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
    toggleUserFavoris
}