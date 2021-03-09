'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categorie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Categorie.belongsTo(models.Espace)
      Categorie.hasMany(models.Article)
      Categorie.hasMany(models.Location)
      Categorie.hasMany(models.Service)
    }
  };
  Categorie.init({
    libelleCateg: DataTypes.STRING,
    descripCateg: DataTypes.STRING,
    typeCateg: DataTypes.STRING,
    imageCateg: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categorie',
  });
  return Categorie;
};