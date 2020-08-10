
module.exports = (sequelize, Sequelize) => {
    const Payement = sequelize.define('payement', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        mode: {
            type: Sequelize.STRING,
            min: 2,
            max: 50
        }
    });
    return Payement;
}