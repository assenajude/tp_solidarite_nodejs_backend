module.exports = (sequelize, Sequelize) => {
    const Service = sequelize.define('service', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        codeService: {
            type: Sequelize.STRING,
            max: 100
        },
        libelle: {
            type: Sequelize.STRING,
            max: 100
        },
        imageService: Sequelize.STRING,
        description: {
            type: Sequelize.STRING,
            max: 200
        },
        montantMin: Sequelize.FLOAT,
        montantMax: Sequelize.FLOAT
    })
    return Service
}