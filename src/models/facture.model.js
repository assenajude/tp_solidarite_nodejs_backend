module.exports = (sequelize, Sequelize) => {
    const Facture = sequelize.define('facture', {
        numero: {
            type: Sequelize.STRING,
            max: 100
        },
        dateEmission: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        dateDebut: Sequelize.DATE,
        dateFin: Sequelize.DATE,
        dateCloture:Sequelize.DATE,
        montant: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        solde: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        },
        status: {
            type: Sequelize.STRING,
            max: 100,
            defaultValue: 'impayé'
        },
        ratio: {
            type: Sequelize.DECIMAL(10,2)
        },
        typeFacture: {
            type: Sequelize.STRING,
            max: 50
        }
    });
    return Facture
}