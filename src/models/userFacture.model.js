module.exports = (sequelize, Sequelize) => {
    const UserFacture = sequelize.define('userFacture', {
        numero: {
            type: Sequelize.STRING,
            min:2,
            max: 50
        },
        montant: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        }
    });
    return UserFacture
}