'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      profession: Sequelize.STRING,
      domaine: Sequelize.STRING,
      statusEmploi: Sequelize.STRING,
      isHero: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      messageCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      articleCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      helpCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      favoriteCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      locationCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      serviceCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      propositionCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      parrainageCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      factureCompter: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      resetToken: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Users');
  }
};