'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Commandes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero: {
        type: Sequelize.STRING
      },
      dateCmde: {
        type: Sequelize.STRING
      },
      dateLivraisonDepart: {
        type: Sequelize.DATE
      },
      statusLivraison: {
        type: Sequelize.STRING
      },
      statusAccord: {
        type: Sequelize.STRING
      },
      dateLivraisonFinal: {
        type: Sequelize.DATE
      },
      itemsLength: {
        type: Sequelize.INTEGER
      },
      interet: {
        type: Sequelize.FLOAT
      },
      fraisTransport: {
        type: Sequelize.FLOAT
      },
      montant: {
        type: Sequelize.INTEGER
      },
      typeCmde: {
        type: Sequelize.STRING
      },
      historique: {
        type: Sequelize.BOOLEAN
      },
      isExpired: {
        type: Sequelize.BOOLEAN
      },
      userId: {
        type: Sequelize.INTEGER
      },
      userAdresseId: {
        type: Sequelize.INTEGER
      },
      planId: {
        type: Sequelize.INTEGER
      },
      shoppingCartId: {
        type: Sequelize.INTEGER
      },
      expireIn: {
        type: Sequelize.STRING,
        defaultValue: '3j 00h 00m 00s'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Commandes');
  }
};