module.exports = (sequelize, Sequelize) => {
    const Ville = sequelize.define('villes', {
        nom: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        },
        kilometrage: Sequelize.FLOAT,
        prixKilo: Sequelize.FLOAT
    });
    return Ville
}