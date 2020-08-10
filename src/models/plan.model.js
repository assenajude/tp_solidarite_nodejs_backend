
module.exports = (sequelize, Sequelize) => {
    const Plan = sequelize.define('plan', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        libelle: {
            type: Sequelize.STRING,
            min:2,
            max: 100
        },
        descripPlan: {
          type: Sequelize.STRING,
          min: 2,
          max: 500
        },

        nombreMensualite: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        compensation: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        }
    });
    return Plan
}