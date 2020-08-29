const db = require('../models');
const UserAdresse = db.userAdresse;
const PointRelais = db.pointRelais;

const addUserAdresse = async (req, res, next) => {
    const pointId = req.body.pointRelaisId;
    const newAdresse = {
        nom: req.body.nom,
        tel: req.body.phone,
        email: req.body.email,
        adresse: req.body.adresse
    };

    try {
        const point = await PointRelais.findByPk(pointId);
        if (!point) return res.status(404).send(`le point d'id ${pointId} n'a pas été trouvé`);
        const newUserAdresse = await point.createUserAdresse(newAdresse);
        return res.status(201).send(newUserAdresse)
    } catch (e) {
        next(e.message)
    }
};

getUserAdresses = async (req, res, next) => {
    try {
        const userAdresses = await UserAdresse.findAll();
        return res.status(200).send(userAdresses)
    } catch (e) {
        next(e.message)
    }
}

module.exports = {
    addUserAdresse,
    getUserAdresses
}