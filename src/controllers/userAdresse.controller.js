const decoder = require('jwt-decode')
const db = require('../../db/models/index');
const UserAdresse = db.UserAdresse
const PointRelais = db.PointRelais;
const User = db.User


const addUserAdresse = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if(!token || token === 'null') return res.status(401).send("Veuillez vous connecter pour ajouter les adresses")
    const connectedUser = decoder(token)
    const pointId = req.body.relaisId;
    const newAdresse = {
        nom: req.body.nom,
        tel: req.body.tel,
        email: req.body.email,
        adresse: req.body.adresse
    };

    const transaction = await db.sequelize.transaction()

    try {
        const point = await PointRelais.findByPk(pointId, {transaction});
        let user = await User.findByPk(connectedUser.id, {transaction})
        if (!user) return res.status(404).send(`l'utilisateur d'id ${connectedUser.id} n'a pas été trouvé`);
        if (!point) return res.status(404).send(`le point relais d'id ${pointId} n'a pas été trouvé`);
        let newUserAdresse = await UserAdresse.create(newAdresse, {transaction});
        await newUserAdresse.setPointRelai(point, {transaction})
        await newUserAdresse.setUser(user, {transaction})
        const newAdded = await UserAdresse.findByPk(newUserAdresse.id, {
            include:[ PointRelais, User],
            transaction
        })
        await transaction.commit()
        return res.status(201).send(newAdded)
    } catch (e) {
        await transaction.rollback()
        next(e.message)
    }
};

getUserAdresses = async (req, res, next) => {
    const token = req.headers['x-access-token']
    if(!token || token === 'null') return res.status(200).send([])
    const user = decoder(token)
    try {
        const connectedUser = await User.findByPk(user.id)
        const userAdresses = await connectedUser.getUserAdresses({
            include: PointRelais
        })
        return res.status(200).send(userAdresses)
    } catch (e) {
        next(e.message)
    }
}


const updateUserAdresse = async (req, res, next) => {
    try {
        let currentAdresse = await UserAdresse.findByPk(req.body.id)
        const relais = await PointRelais.findByPk(req.body.relaisId)
        if(!currentAdresse) return res.status(404).send(`L'adresse d'id ${req.body.id} n'existe pas `)
        await currentAdresse.update({
            nom: req.body.nom,
            tel: req.body.tel,
            email: req.body.email,
            adresse: req.body.adresse
        })
        await currentAdresse.setPointRelai(relais)
        const updated = await UserAdresse.findByPk(currentAdresse.id, {
            include: PointRelais
        })
        return res.status(200).send(updated)
    } catch (e) {
        next(e.message)
    }
}

const deleteUserAdresse = async (req, res, next) => {
    try{
        const currentAdresse = req.body
        const selectedAdresse = await UserAdresse.findByPk(currentAdresse.id)
        if(!selectedAdresse) return res.status(404).send('Adresse introuvable')
        await selectedAdresse.destroy()
        return res.status(200).send(currentAdresse)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    addUserAdresse,
    getUserAdresses,
    updateUserAdresse,
    deleteUserAdresse
}