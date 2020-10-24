module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        nom: {
          type: Sequelize.STRING,
            max: 255
        },
        prenom: {
          type: Sequelize.STRING,
            max: 255
        },
        phone: {
          type: Sequelize.STRING,
            max: 20
        },
        adresse: {
          type: Sequelize.STRING,
            max: 50
        },
        avatar: Sequelize.BLOB,
        pieceIdentite: Sequelize.BLOB

    });
    return User;
};