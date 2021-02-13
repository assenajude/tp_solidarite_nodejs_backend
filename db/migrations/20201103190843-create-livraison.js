'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Livraisons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateLivraison: {
        type: Sequelize.DATE
      },
      qteLivraison: {
        type: Sequelize.INTEGER
      },
      montantLivraison: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      commandeId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Livraisons');
  }
};