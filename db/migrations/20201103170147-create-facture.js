'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('factures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero: {
        type: Sequelize.STRING
      },
      dateEmission: {
        type: Sequelize.DATE
      },
      dateDebut: {
        type: Sequelize.DATE
      },
      dateFin: {
        type: Sequelize.DATE
      },
      dateCloture: {
        type: Sequelize.DATE
      },
      montant: {
        type: Sequelize.INTEGER
      },
      solde: {
        type: Sequelize.INTEGER
      },
      ratio: {
        type: Sequelize.DECIMAL(10,1)
      },
      status: {
        type: Sequelize.STRING
      },
      typeFacture: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('factures');
  }
};