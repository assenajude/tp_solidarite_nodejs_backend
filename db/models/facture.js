'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Facture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Facture.belongsTo(models.Commande)
      Facture.hasMany(models.Tranche)
    }
  };
  Facture.init({
    numero: DataTypes.STRING,
    dateEmission: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE,
    dateCloture: DataTypes.DATE,
    montant: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    solde: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ratio: {
      type: DataTypes.DECIMAL(10,1),
      defaultValue: 0
    },
    status: DataTypes.STRING,
    typeFacture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Facture',
  });
  return Facture;
};