module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define('locations', {
        codeLocation: {
            type: Sequelize.STRING,
            max: 20
        },
        libelleLocation: {
            type: Sequelize.STRING,
            max: 100
        },
        descripLocation: {
            type: Sequelize.STRING,
            max: 255
        },
        adresseLocation: {
            type: Sequelize.STRING,
            max: 100
        },
        coutLocation: {
            type: Sequelize.INTEGER,
            defaultValue: 5
        },
        frequenceLocation: {
            type: Sequelize.STRING,
            max: 100
        },
        imageLocation: Sequelize.STRING,
        debutLocation: Sequelize.DATE,
        finLocation: Sequelize.DATE,
        nombreCaution: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        nombrePretendant: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });
return Location;
}