module.exports = (sequelize, Sequelize) => {
    const ReserveLocation = sequelize.define('reserveLocation', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        libelle: {
            type: Sequelize.STRING,
            max: 100
        },
        descripReserve: Sequelize.STRING,
        montantReserve: Sequelize.FLOAT
    })
}