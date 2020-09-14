const db = require('../models');
const UserAdresse = db.userAdresse;
const PointRelais = db.pointRelais;
const User = db.user

const addUserAdresse = async (req, res, next) => {
    const pointId = req.body.relaisId;
    const userId = req.body.idUser;

    const newAdresse = {
        nom: req.body.nom,
        tel: req.body.tel,
        email: req.body.email,
        adresse: req.body.adresse
    };

    try {
        const point = await PointRelais.findByPk(pointId);
        let user = await User.findByPk(userId)
        if (!user) return res.status(404).send(`l'utilisateur d'id ${userId} n'a pas été trouvé`);
        if (!point) return res.status(404).send(`le point relais d'id ${pointId} n'a pas été trouvé`);
        let newUserAdresse = await user.createUserAdresse(newAdresse);
        await newUserAdresse.setPointRelai(point)
        return res.status(201).send(newUserAdresse)
    } catch (e) {
        next(e.message)
    }
};

getUserAdresses = async (req, res, next) => {
    try {
        const userAdresses = await UserAdresse.findAll({
            include: PointRelais
        });
        return res.status(200).send(userAdresses)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    addUserAdresse,
    getUserAdresses
}