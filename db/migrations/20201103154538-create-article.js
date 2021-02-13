'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codeArticle: {
        type: Sequelize.STRING
      },
      designArticle: {
        type: Sequelize.STRING
      },
      descripArticle: {
        type: Sequelize.STRING
      },
      qteStock: {
        type: Sequelize.INTEGER
      },
      prixReel: {
        type: Sequelize.INTEGER
      },
      prixPromo: {
        type: Sequelize.INTEGER
      },
      imagesArticle: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      aide: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Articles');
  }
};