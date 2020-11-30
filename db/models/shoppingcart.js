'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShoppingCart.belongsTo(models.User)
      ShoppingCart.belongsToMany(models.Article, {
        through: models.CartItem,
        foreignKey: 'shoppingCartId',
        otherKey: 'articleId'
      })
      ShoppingCart.belongsToMany(models.Location, {
        through: models.CartItem,
        foreignKey: 'shoppingCartId',
        otherKey: 'locationId'
      })
      ShoppingCart.belongsToMany(models.Service, {
        through: models.CartItem,
        foreignKey: 'shoppingCartId',
        otherKey: 'serviceId'
      })
    }
  };
  ShoppingCart.init({
    cartLength: {
      type: DataTypes.INTEGER,
    defaultValue: 0
    },
    cartAmount: {
      type: DataTypes.INTEGER,
    defaultValue: 0}
  }, {
    sequelize,
    modelName: 'ShoppingCart',
  });
  return ShoppingCart;
};