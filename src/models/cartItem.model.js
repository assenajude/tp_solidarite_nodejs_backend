module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define('cartItem', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        libelle: {
            type: Sequelize.STRING,
            max: 100
        },
        image: Sequelize.STRING,
        prix: Sequelize.FLOAT
    })
    return CartItem
}