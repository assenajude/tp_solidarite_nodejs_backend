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
    await queryInterface.bulkInsert('Articles', [{
      designArticle: 'Chaussure de securite',
      qteStock: 10,
      prixReel: 25000,
      prixPromo: 20000,
      imageArticle: '',
      aide: true,
      descripArticle:'Chaussure de securite de haute qualité',
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }],{});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Articles',null, {} )
  }
};
