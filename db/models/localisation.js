'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Localisation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Localisation.belongsTo(models.Ville)
      Localisation.hasMany(models.Location)
    }
  };
  Localisation.init({
    quartier: DataTypes.STRING,
    adresse: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Localisation',
  });
  return Localisation;
};