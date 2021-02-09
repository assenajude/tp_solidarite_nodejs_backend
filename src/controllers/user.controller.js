
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
        let lienAvatar;
        let currentUser = await User.findByPk(user.id)
        if(!currentUser) return res.status(404).send(`L'utilisateur d'id ${user.id} n'existe pas`)
        if (!req.files) {
            return res.status(400).send('Aucune image pour mettre a jour votre profil')
        } else {
         lienAvatar = req.body.deleting?null:`${req.protocol}://${req.get('host')}/avatars/${req.files[0].filename}`
        }


        //const imageResize = await sharp(req.file.buffer).resize({width: 200, height: 200}).png().toBuffer()
        currentUser.avatar = lienAvatar
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
            pieceIdentite: connectedUser.pieceIdentite,
                profession: connectedUser.profession,
                domaine: connectedUser.domaine,
                statusEmploi: connectedUser.statusEmploi,
                isHero: connectedUser.isHero
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

        if(typeRequest === 'article') {
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
/*

const getUserMessage = async(req, res, next) => {
    const token = req.headers['x-access-token']
    const user = decoder(token)
    try {
        const connectedUser = await User.findByPk(user.id)
        const userMessages = await Message.findAll({
            where: {
                [Op.or]:[
                    {receiverId: connectedUser.id},
                    {senderId: connectedUser.id}
                    ]

            },
            include: MsgResponse
        })
        return res.status(200).send(userMessages)
    } catch (e) {
        next(e.message)
    }
}

const getUserMessageRead = async (req, res, next) => {
    try{
        let selectedMessage = await Message.findByPk(req.body.messageId)
        if(req.body.isRead) {
        selectedMessage.isRead = req.body.isRead
        }else {
            selectedMessage.msgHeader = req.body.title
            selectedMessage.content = req.body.message
        }
        await selectedMessage.save()
        return res.status(200).send(selectedMessage)
    } catch (e) {
        next(e.message)
    }
}

const sendMessageToToutPromo = async (req,res, next) => {
    try{
        const sender = await User.findByPk(req.body.userId)
        const receiver = await User.findByPk(1)
        let sentMessage = await Message.create({
            msgHeader: req.body.title,
            content: req.body.message
        })
        await sentMessage.setSender(sender)
        await sentMessage.setReceiver(receiver)
        return res.status(200).send(sentMessage)
    } catch (e) {
        next(e.message)
    }
}

const respondeToMsg = async (req, res, next)=> {
    try{
        let selectedMsg = await Message.findByPk(req.body.messageId)
        await selectedMsg.createMsgResponse({
            respHeader: req.body.title,
            respContent: req.body.reponse
        })
        const newUpdated = await Message.findByPk(selectedMsg.id, {
            include: MsgResponse
        })
        return res.status(200).send(newUpdated)
    } catch (e) {
        next(e.message)
    }
}
*/
module.exports = {
    updateProfile,
    addUserAvatar,
    addUserPiece,
    getUserProfileAvatar,
    getConnectedUserData,
    getUserFavoris,
    toggleUserFavoris
}