module.exports = (sequelize, Sequelize) => {
    const Livraison = sequelize.define('livraison', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dateLivraison: Sequelize.DATE,
        qteLivraison: Sequelize.INTEGER,
        montantLivraison: Sequelize.FLOAT,
        status: {
            type: Sequelize.STRING,
            defaultValue: 'en cours',
            max: 50
        }
    })
    return Livraison
}