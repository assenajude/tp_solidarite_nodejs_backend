'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PointRelais extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PointRelais.belongsTo(models.Ville)
      PointRelais.hasMany(models.UserAdresse)
    }
  };
  PointRelais.init({
    nom: DataTypes.STRING,
    adresse: DataTypes.STRING,
    contact: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PointRelais',
  });
  return PointRelais;
};