const logger = require('../../src/startup/logger')
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
          'Users',
          'nom',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'Users',
          'prenom',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'Users',
          'adresse',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'Users',
          'phone',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'Users',
          'avatar',
          {
            type: Sequelize.STRING,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'Users',
          'pieceIdentite',
          {
            type: Sequelize.STRING,
          },
          {transaction}
      );
      await transaction.commit()
    } catch (e) {
      logger.error(e)
      await transaction.rollback()
    }

  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    try {
    await queryInterface.removeColumn(
        'Users',
        'nom',
        {transaction}
    );
    await queryInterface.removeColumn(
        'Users',
        'prenom',
        {transaction}
    );
    await queryInterface.removeColumn(
        'Users',
        'adresse',
        {transaction}
    );
    await queryInterface.removeColumn(
        'Users',
        'phone',
        {transaction}
    );
    await queryInterface.removeColumn(
        'Users',
        'avatar',
        {transaction}
    ); await queryInterface.removeColumn(
        'Users',
        'pieceIdentite',
          {transaction}
    );

    await transaction.commit()

    } catch (e) {
      logger.error(e)
      await transaction.rollback()
    }
  }
};
