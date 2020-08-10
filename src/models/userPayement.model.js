

module.exports =  (sequelize, Sequelize) => {
    const UserPayement = sequelize.define('userPayement', {
        code: {
            type: Sequelize.STRING,
            min:5,
            max:20
        },
        montant: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        }
    });
    return UserPayement
}