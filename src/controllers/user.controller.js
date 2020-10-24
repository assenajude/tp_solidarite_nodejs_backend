const bcrypt = require('bcryptjs')
const db = require('../models/index')
const User = db.user
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
            registeredUser.adresse = req.body.adresse,
            registeredUser.password = bcrypt.hashSync(req.body.password, 8)
        if (req.body.roles) {
            const userRoles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            })
            await registeredUser.setRoles(userRoles);
        } else {
            await registeredUser.setRoles([3]);
        };
        await registeredUser.save()
        res.status(201).send(`Vos infos ont été mises à jour avec succès`)

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
        if (!req.file) {
            return res.status(400).send('Aucune image pour votre mettre a jour votre profil')
        }
        currentUser.avatar = req.file.buffer
        await currentUser.save()
        return res.status(200).send('Votre profil a été mis à jour avec succès')
    } catch (e) {
        next(e.message)
    }
}

addUserPiece = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.body.userId)
        if(!user) return res.status(404).send(`L'utilisateur d'id ${req.body.userId} n'existe pas`)
        if(!req.file) return res.status(400).send('Aucune image pour mettre a jour votre profil')
        user.pieceIdentite = req.file.buffer
        await user.save()
        return res.status(200).send('votre profil a été mis à jour avec succes')
    } catch (e) {
        next(e.message)
    }
}


module.exports = {
    updateProfile,
    addUserAvatar,
    addUserPiece
}