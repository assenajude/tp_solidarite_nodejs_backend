

module.exports = (sequelize, Sequelize) => {
    const UserAdresse = sequelize.define('userAdresse', {
        nom: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        },
        tel: {
            type: Sequelize.STRING,
            max: 50
        },
        email: {
          type: Sequelize.STRING,
        },
        adresse: {
            type: Sequelize.STRING,
            max: 150
        }
    })
    return UserAdresse
}