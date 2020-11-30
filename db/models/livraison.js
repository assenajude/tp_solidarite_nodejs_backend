'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Livraison extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Livraison.belongsTo(models.Commande)
    }
  };
  Livraison.init({
    dateLivraison: DataTypes.DATE,
    qteLivraison: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    montantLivraison: {
      type: DataTypes.INTEGER,
       defaultValue: 0
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'En cours'
    },
  }, {
    sequelize,
    modelName: 'Livraison',
  });
  return Livraison;
};