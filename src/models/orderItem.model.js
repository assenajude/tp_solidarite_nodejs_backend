module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define('orderItem', {
        quantite: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        montant: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        }

    })
    return OrderItem
}