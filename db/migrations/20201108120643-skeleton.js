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
          'users',
          'nom',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'users',
          'prenom',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'users',
          'adresse',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'users',
          'phone',
          {
            type: Sequelize.INTEGER,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'users',
          'avatar',
          {
            type: Sequelize.STRING,
          },
          {transaction}
      );
      await queryInterface.addColumn(
          'users',
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
        'users',
        'nom',
        {transaction}
    );
    await queryInterface.removeColumn(
        'users',
        'prenom',
        {transaction}
    );
    await queryInterface.removeColumn(
        'users',
        'adresse',
        {transaction}
    );
    await queryInterface.removeColumn(
        'users',
        'phone',
        {transaction}
    );
    await queryInterface.removeColumn(
        'users',
        'avatar',
        {transaction}
    ); await queryInterface.removeColumn(
        'users',
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
