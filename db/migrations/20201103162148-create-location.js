'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codeLocation: {
        type: Sequelize.STRING
      },
      libelleLocation: {
        type: Sequelize.STRING
      },
      descripLocation: {
        type: Sequelize.STRING
      },
      adresseLocation: {
        type: Sequelize.STRING
      },
      coutReel: {
        type: Sequelize.INTEGER
      },
      coutPromo: {
        type: Sequelize.INTEGER
      },
      frequenceLocation: {
        type: Sequelize.STRING
      },
      imagesLocation: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      debutLocation: {
        type: Sequelize.DATE
      },
      finLocation: {
        type: Sequelize.DATE
      },
      nombreCaution: {
        type: Sequelize.INTEGER
      },
      nombrePretendant: {
        type: Sequelize.INTEGER
      },
      aide: {
        type: Sequelize.BOOLEAN
      },
      qteDispo: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('locations');
  }
};