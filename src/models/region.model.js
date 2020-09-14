module.exports = (sequelize, Sequelize) => {
    const Region = sequelize.define('regions', {
        nom: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        },
        localisation: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        }
    });
    return Region
}