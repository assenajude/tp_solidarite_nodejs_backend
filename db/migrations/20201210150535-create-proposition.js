'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propositions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      designation: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      typeReference: {
        type: Sequelize.STRING
      },
      referenceId: {
        type: Sequelize.INTEGER
      },
      isOk: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      dateAchat: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      imagesProposition: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.dropTable('propositions');
  }
};