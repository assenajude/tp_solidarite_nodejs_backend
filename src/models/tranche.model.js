module.exports = (sequelize, Sequelize) => {
    const Tranche = sequelize.define('tranche', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        numero: {
            type: Sequelize.STRING,
            max: 100
        },
        dateEmission: {
            type:Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        dateEcheance: Sequelize.DATE,
        montant: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        solde: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        payed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return Tranche
}