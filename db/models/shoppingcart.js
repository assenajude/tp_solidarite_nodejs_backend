'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingCart extends Model {
    async getContents(options){
      const articles = await this.getArticles(options)
      const locations = await this.getLocations(options)
      const services = await this.getServices(options)
      return articles.concat(locations, services)
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShoppingCart.belongsTo(models.User)
      ShoppingCart.belongsToMany(models.Article, {
        through: {
          model: models.CartItem,
          unique: false
        },
        foreignKey: 'shoppingCartId',
        constraints: false
      })
      ShoppingCart.belongsToMany(models.Location, {
        through: {
          model: models.CartItem,
          unique: false
        },
        foreignKey: 'shoppingCartId',
        constraints: false
      })
      ShoppingCart.belongsToMany(models.Service, {
        through: {
          model: models.CartItem,
          unique: false
        },
        foreignKey: 'shoppingCartId',
        constraints: false
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