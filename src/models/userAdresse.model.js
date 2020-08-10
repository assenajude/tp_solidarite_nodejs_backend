

module.exports = (sequelize, Sequelize) => {
    const UserAdresse = sequelize.define('userAdresse', {
        id: {

                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true

        },
        region: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        },
        ville: {
            type: Sequelize.STRING,
            min: 2,
            max: 100
        },
        relais: {
            type: Sequelize.STRING,
            min: 2,
            max: 200
        },
        frais: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    })
    return UserAdresse
}