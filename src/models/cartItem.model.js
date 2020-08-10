
module.exports =  (sequelize, Sequelize) => {
    const CartItem = sequelize.define('cartItem', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        designation: Sequelize.STRING,
        quantite: {
            type: Sequelize.INTEGER,
            defaultValue:1
        },
        price: Sequelize.INTEGER,
        itemAmount: Sequelize.INTEGER
    });
    return CartItem
}