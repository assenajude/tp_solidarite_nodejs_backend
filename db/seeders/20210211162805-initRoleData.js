'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('roles', [
        {
            name: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()

        },
      {
          name: 'moderator',
          createdAt: new Date(),
          updatedAt: new Date()
      },
      {
          name: 'user',
          createdAt: new Date(),
          updatedAt: new Date()
      } ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
   await queryInterface.bulkDelete('roles', null, {});

  }
};
