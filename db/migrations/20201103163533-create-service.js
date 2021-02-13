'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codeService: {
        type: Sequelize.STRING
      },
      liblle: {
        type: Sequelize.STRING
      },
      imagesService: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      description: {
        type: Sequelize.STRING
      },
      montantMin: {
        type: Sequelize.INTEGER
      },
      montantMax: {
        type: Sequelize.INTEGER
      },
      isDispo: {
        type: Sequelize.BOOLEAN
      },
      categoryId: {
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
    await queryInterface.dropTable('Services');
  }
};