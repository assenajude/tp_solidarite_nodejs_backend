

module.exports = (sequelize, Sequelize) => {
    const ShoppingCart = sequelize.define('shoppingCart', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cartLength: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        cartAmount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }

    });
    return ShoppingCart;

}