
module.exports = (sequelize, Sequelize) => {
    const Commande = sequelize.define('commande', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dateCmde: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        items: Sequelize.JSON,
        itemsLength: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        montant: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }

    });
    return Commande
}