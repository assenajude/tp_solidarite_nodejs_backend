'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ville extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ville.belongsTo(models.Region)
      Ville.hasMany(models.PointRelais)
    }
  };
  Ville.init({
    nom: DataTypes.STRING,
    kilometrage: {
      type: DataTypes.FLOAT,
    defaultValue: 0},
    prixKilo: {
      type: DataTypes.INTEGER,
    defaultValue: 0},
  }, {
    sequelize,
    modelName: 'Ville',
  });
  return Ville;
};