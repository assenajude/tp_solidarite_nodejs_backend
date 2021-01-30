'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  OrderItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
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
    couleur: {
      type: DataTypes.STRING
    },
    taille: {
      type: DataTypes.STRING
    },
    modele: {
      type: DataTypes.STRING
    },
    montant: {
      type: DataTypes.INTEGER,
    defaultValue: 0}
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};