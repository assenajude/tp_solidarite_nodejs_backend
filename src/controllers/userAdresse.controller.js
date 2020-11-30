const decoder = require('jwt-decode')
const db = require('../../db/models/index');
const UserAdresse = db.UserAdresse
const PointRelais = db.PointRelais;
const User = db.User


const addUserAdresse = async (req, res, next) => {
    const token = req.headers['x-access-token']
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
    const user = decoder(token)
    try {
        const connectedUser = await User.findByPk(user.id)
        const userAdresses = await connectedUser.getUserAdresses({
            include: PointRelais
        })
  /*      const userAdresses = await UserAdresse.findAll({
            where: {
                  userId: user.id
            },
            include: [{all: true}]
        });

   */
        return res.status(200).send(userAdresses)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    addUserAdresse,
    getUserAdresses
}