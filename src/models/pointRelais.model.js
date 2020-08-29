module.exports = (sequelize, Sequelize) => {
    const PointRelais = sequelize.define('pointRelais', {
        nom: {
            type: Sequelize.STRING,
            min:2,
            max: 100
        },
        adresse: {
            type: Sequelize.STRING,
            max: 150
        },
        contact: {
            type: Sequelize.STRING,
            max: 50
        },
        email: {
            type: Sequelize.STRING
        }
    });
    return PointRelais
}