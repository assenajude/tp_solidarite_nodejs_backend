
module.exports = (sequelize, Sequelize) => {
    const Commande = sequelize.define('commande', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        numero: {
            type: Sequelize.STRING,
            max: 100
        },
        dateCmde: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        dateLivraisonDepart: Sequelize.DATE,
        statusLivraison: {
            type: Sequelize.STRING,
            max: 50,
            defaultValue: 'en cours'
        },
        statusAccord: {
            type: Sequelize.STRING,
            max: 50,
            defaultValue: 'en cours de traitement'
        },
        dataLivraisonFinal:Sequelize.DATE,

        itemsLength: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        interet: {
          type: Sequelize.FLOAT,
          defaultValue: 0
        },
        fraisTransport: {
          type: Sequelize.FLOAT,
          defautValue: 0
        },
        montant: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        typeCmde: {
            type: Sequelize.STRING,
            max: 20
        },
        historique: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }

    });
    return Commande
}