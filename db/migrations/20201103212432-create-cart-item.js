'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cartItems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      shoppingCartId: {
        type: Sequelize.INTEGER,
        unique: 'tt_unique_constraint'
      },
      itemId: {
        type: Sequelize.INTEGER,
        unique: 'tt_unique_constraint',
        references: null
      },
      itemType: {
        type: Sequelize.STRING,
        unique: 'tt_unique_constraint'
      },
      quantite: Sequelize.INTEGER,
      prix: Sequelize.INTEGER,
      montant: Sequelize.INTEGER,
      couleur: Sequelize.STRING,
      taille: Sequelize.STRING,
      modele: Sequelize.STRING,
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
    await queryInterface.dropTable('cartItems');
  }
};