'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {

  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Plan.belongsTo(models.Payement)
      Plan.hasMany(models.Commande)
    }
  };
  Plan.init({
    libelle: DataTypes.STRING,
    descripPlan: DataTypes.STRING,
    nombreMensualite: {
      type: DataTypes.INTEGER,
    defaultValue: 0
    },
    compensation: {
      type: DataTypes.FLOAT,
    defaultValue: 0
    },
    imagesPlan: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  }, {
    sequelize,
    modelName: 'Plan',
  });
  return Plan;
};