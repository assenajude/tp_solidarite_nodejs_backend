const db = require('../../db/models')
const randomstring = require('randomstring')
const bcrypt = require('bcryptjs')
const adminUser = require('../utilities/checkAdminConnect')
const User = db.User
const Article = db.Article
const Location = db.Location
const Categorie = db.Categorie
const decoder = require('jwt-decode')
const {sendPushNotification} = require('../utilities/pushNotification')


const getAllUsers = async (req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    const isAdmin = adminUser(user)
    try {
        let allUsers = []
        if(!isAdmin)return res.status(401).send("Vous netes pas autorisés.")
            if(isAdmin){
                allUsers = await User.findAll({
                    attributes: {exclude: ['password']}
                })
            }
            return res.status(200).send(allUsers)
    }catch (e) {
        next(e)
    }
}


updateProfile = async (req, res, next) => {
    try {

        const registeredUser = await User.findByPk(req.body.userId, {
            attributes: {exclude: ['password']}
        })
        if(!registeredUser) return res.status(404).send(`L'utilisateur d'id ${req.body.userId} n'existe pas`)
        if(req.body.username) registeredUser.username = req.body.username
        if (req.body.email) registeredUser.email = req.body.email
        if(req.body.nom) registeredUser.nom = req.body.nom
        if(req.body.prenom) registeredUser.prenom = req.body.prenom
        if(req.body.phone) registeredUser.phone = req.body.phone
        if(req.body.adresse) registeredUser.adresse = req.body.adresse
        if(req.body.profession) registeredUser.profession = req.body.profession
        if(req.body.domaine) registeredUser.domaine = req.body.domaine
        if(req.body.statusEmploi) registeredUser.statusEmploi = req.body.statusEmploi
        if(req.body.pushNotificationToken) {
            const tokenExist = registeredUser.pushNotificationToken
            const userData = registeredUser.username?registeredUser.username : registeredUser.email?registeredUser.email : ''
            const message = tokenExist?`Bienvenue ${userData}, merci d'utiliser sabbat-confort sur votre nouvel appareil.` : `Bienvenue ${userData} nous sommes heureux de vous recevoir.`
            registeredUser.pushNotificationToken = req.body.pushNotificationToken
            sendPushNotification(message, [req.body.pushNotificationToken],'Bienvenue', {notifType: 'welcome'})
        }
        await registeredUser.save()
        res.status(200).send(registeredUser)
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
        if(req.body.favoriteCompter) user.favoriteCompter = 0
        if(req.body.factureCompter) user.factureCompter = 0
        if(req.body.articleCompter) user.articleCompter = 0
        if(req.body.locationCompter) user.locationCompter = 0
        if(req.body.serviceCompter) user.serviceCompter = 0
        if(req.body.propositionCompter) user.propositionCompter = 0
        if(req.body.parrainageCompter) user.parrainageCompter = 0
        await user.save()
        const updatedUser = await User.findByPk(user.id, {
            attributes:{exclude: ['password']}
        })
        return res.status(200).send(updatedUser)
    } catch (e) {
        next(e.message)
    }
}


const resetCredentials = async (req, res, next) => {
    try {
        let selectedUser;
        if(req.body.email) {
            selectedUser = await User.findOne({
                where: {
                    email: req.body.email
                }
            })
        }
        if(!selectedUser) return res.status(404).send({message: "Utilisateur non trouvé."})
        const newPassword = randomstring.generate({
            length: 8,
            charset: 'alphanumeric'
        });
        await selectedUser.update({
            password: bcrypt.hashSync(String(newPassword), 8)
        })
        if(selectedUser.pushNotificationToken) {
            const userName = selectedUser.username?selectedUser.username : selectedUser.nom?selectedUser.nom: ''
            sendPushNotification(`${userName} vos paramètres de connexion ont été reinitialisés, veuillez nous contacter pour avoir les nouveaux paramètres.`, [selectedUser.pushNotificationToken], "Reinitialisation paramètres de connexion.", {notifType: "params"})
        }
        return res.status(200).send({randomCode: newPassword})
    } catch (e) {
        next(e)
    }
}
const changeCredentials = async (req,res, next) => {
    try {
        const selectedUser = await User.findByPk(req.body.userId)
        if(req.body.oldPass) {
            const isValidPass = bcrypt.compareSync(req.body.oldPass, selectedUser.password)
            if(!isValidPass)return res.status(401).send({message: "Le mot de passe ne correspond pas à celui enregistré"})
            selectedUser.password = bcrypt.hashSync(req.body.newPass, 8)
        }
        await selectedUser.save()
        const userName = selectedUser.username?selectedUser.username : selectedUser.nom?selectedUser.nom: ''
        sendPushNotification(`${userName} vos paramètres de connexion viennent d'être changés, si cela ne vient pas de vous, contactez-nous immediatement.`, [selectedUser.pushNotificationToken], "Reinitialisation paramètres de connexion.", {notifType: "params"})
        return res.status(200).send({message: "Vos paramètres ont été mis à jour avec succès."})
    } catch (e) {
        next(e)
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
    resetCompter,
    resetCredentials,
    changeCredentials,
    getAllUsers
}