'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contrat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contrat.belongsTo(models.Commande)
      // define association here
    }
  };
  Contrat.init({
    dateDebut: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    dateFin: DataTypes.DATE,
    dateCloture: DataTypes.DATE,
    montant: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    mensualite: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'En cours'
    }
  }, {
    sequelize,
    modelName: 'Contrat',
  });
  return Contrat;
};