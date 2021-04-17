'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tranche extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tranche.belongsTo(models.Facture)
    }
  };
  Tranche.init({
    numero: DataTypes.STRING,
    dateEmission: {
      type: DataTypes.DATE,
    defaultValue: DataTypes.NOW},
    dateEcheance: DataTypes.DATE,
    montant: {
      type: DataTypes.INTEGER,
    defaultValue: 0
    },
    solde: {
      type: DataTypes.INTEGER,
    defaultValue: 0
    },
    payed: {
      type: DataTypes.BOOLEAN,
    defaultValue: false
    },
    payedState: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tranche',
  });
  return Tranche;
};