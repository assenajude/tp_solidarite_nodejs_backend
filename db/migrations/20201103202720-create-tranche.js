'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tranches', {
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
      dateEcheance: {
        type: Sequelize.DATE
      },
      montant: {
        type: Sequelize.INTEGER
      },
      solde: {
        type: Sequelize.INTEGER
      },
      payed: {
        type: Sequelize.BOOLEAN
      },
      payedState: {
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
    await queryInterface.dropTable('Tranches');
  }
};