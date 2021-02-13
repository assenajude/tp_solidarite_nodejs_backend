'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      libelle: {
        type: Sequelize.STRING
      },
      descripPlan: {
        type: Sequelize.STRING
      },
      nombreMensualite: {
        type: Sequelize.INTEGER
      },
      compensation: {
        type: Sequelize.FLOAT
      },
      imagesPlan: {
        type: Sequelize.ARRAY(Sequelize.STRING)
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
    await queryInterface.dropTable('Plans');
  }
};