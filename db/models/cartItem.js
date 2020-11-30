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
    libelle: DataTypes.STRING,
    image: DataTypes.STRING,
    prix: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    quantite: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    montant: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    couleur: DataTypes.STRING,
    taille: DataTypes.STRING,
    montantMin: DataTypes.INTEGER,
    montantMax: DataTypes.INTEGER,
    typeCmde: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};