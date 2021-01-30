'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartItem.belongsToMany(models.Commande, {
        through: models.OrderItem,
        foreignKey: 'cartItemId',
        otherKey: 'commandeId'
      })
    }

  };
  CartItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    shoppingCartId: {
      type: DataTypes.INTEGER,
      unique: 'tt_unique_constraint'
    },
    itemId: {
      type: DataTypes.INTEGER,
      unique: 'tt_unique_constraint',
      references: null
    },
    itemType: {
      type: DataTypes.STRING,
      unique: 'tt_unique_constraint'
    },

    quantite: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    prix: DataTypes.INTEGER,
    montant: DataTypes.INTEGER,
    couleur: DataTypes.STRING,
    taille: DataTypes.STRING,
    modele: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};