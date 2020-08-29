module.exports = (sequelize, Sequelize) => {
    const AdresseLivraison = sequelize.define('adresseLivraison', {
        region: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        },
        ville: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        },
        distance: {
            type: Sequelize.STRING
        },
        coutLivraison: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });
    return AdresseLivraison
}